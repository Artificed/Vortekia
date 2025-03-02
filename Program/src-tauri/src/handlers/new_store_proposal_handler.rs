use tauri::State;

use crate::{
    factories::new_store_proposal_factory, modules::app_state::AppState,
    repositories::new_store_proposal_repository,
};

use crate::models::new_store_proposal::Model as NewStoreProposalModel;

use super::file_handler;

pub async fn insert_new_store_proposal(
    state: &State<'_, AppState>,
    store_name: String,
    store_description: String,
    reason: String,
    image: String,
    image_bytes: Vec<u8>,
) -> Result<(), String> {
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
