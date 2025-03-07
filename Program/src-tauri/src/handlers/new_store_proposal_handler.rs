use tauri::State;

use super::{file_handler, store_handler};
use crate::models::new_store_proposal::Model as NewStoreProposalModel;
use crate::repositories::store_repository;
use crate::{
    factories::new_store_proposal_factory, modules::app_state::AppState,
    repositories::new_store_proposal_repository,
};

pub async fn insert_new_store_proposal(
    state: &State<'_, AppState>,
    store_name: String,
    store_description: String,
    reason: String,
    image: String,
    image_bytes: Vec<u8>,
) -> Result<(), String> {
    if store_name.is_empty() {
        return Err("Store name must not be empty!".to_string());
    }
    if store_description.is_empty() {
        return Err("Store description must not be empty!".to_string());
    }
    if reason.is_empty() {
        return Err("Reason must not be empty!".to_string());
    }
    if image.is_empty() || image_bytes.is_empty() {
        return Err("Image must not be empty!".to_string());
    }

    let stores = store_repository::get_all_stores(state).await?;
    if stores.iter().any(|store| store.name == store_name) {
        return Err("Store name is taken!".to_string());
    }

    let img_url_result = file_handler::upload_image_to_firebase(&image, &image_bytes).await;

    match img_url_result {
        Ok(img_url) => {
            let proposal = new_store_proposal_factory::create_store_proposal(
                store_name,
                img_url,
                store_description,
                reason,
            );
            new_store_proposal_repository::insert_new_store_proposal(state, proposal).await
        }
        Err(err) => Err(format!("Failed to upload image: {}", err)),
    }
}

pub async fn get_all_new_store_proposals(
    state: &State<'_, AppState>,
) -> Result<Vec<NewStoreProposalModel>, String> {
    new_store_proposal_repository::get_all_new_store_proposals(state).await
}

pub async fn update_new_store_proposal_approval(
    state: State<'_, AppState>,
    id: String,
    approve: i8,
    opening_time: String,
    closing_time: String,
) -> Result<(), String> {
    new_store_proposal_repository::update_new_store_proposal_approval(&state, &id, approve)
        .await
        .unwrap();

    if approve == 1 {
        let proposal = new_store_proposal_repository::get_store_proposal(&state, &id).await?;

        let store_name = proposal.store_name.clone();
        let description = proposal.store_description.clone();
        let image = proposal.store_image.clone();

        store_handler::insert_new_store(
            &state,
            store_name,
            opening_time,
            closing_time,
            description,
            image,
        )
        .await
        .expect("Failed to insert new store!");
    }

    Ok(())
}
