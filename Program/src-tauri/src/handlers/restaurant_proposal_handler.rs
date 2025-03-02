use tauri::State;

use crate::factories::resturant_proposal_factory;
use crate::{modules::app_state::AppState, repositories::restaurant_proposal_repository};

use crate::models::new_restaurant_proposal::Model as NewRestaurantProposalModel;

use super::file_handler;

pub async fn insert_new_restaurant_proposal(
    state: &State<'_, AppState>,
    restaurant_name: String,
    opening_time: String,
    closing_time: String,
    cuisine_type: String,
    image: String,
    image_bytes: Vec<u8>,
) -> Result<(), String> {
    let img_url_result = file_handler::upload_image_to_firebase(&image, &image_bytes).await;

    match img_url_result {
        Ok(img_url) => {
            let proposal = resturant_proposal_factory::create_restaurant_proposal(
                &restaurant_name,
                &img_url,
                &opening_time,
                &closing_time,
                &cuisine_type,
            );
            restaurant_proposal_repository::insert_new_restaurant_proposal(state, proposal).await
        }
        Err(err) => Err(format!("Failed to upload image: {}", err)),
    }
}

pub async fn get_all_new_restaurant_proposals(
    state: &State<'_, AppState>,
) -> Result<Vec<NewRestaurantProposalModel>, String> {
    restaurant_proposal_repository::get_all_new_restaurant_proposals(state).await
}

pub async fn update_new_restaurant_proposal_cfo_approval(
    state: &State<'_, AppState>,
    id: &str,
    approve: i8,
) -> Result<(), String> {
    restaurant_proposal_repository::update_new_restaurant_proposal(state, id, approve, 1, 0, 0)
        .await
}

pub async fn update_new_restaurant_proposal_ceo_approval(
    state: &State<'_, AppState>,
    id: &str,
    approve: i8,
) -> Result<(), String> {
    let existing_proposal = restaurant_proposal_repository::get_restaurant_proposal(state, id)
        .await
        .expect("Failed to get restaurant proposal!");

    if existing_proposal.cfo_done == 0 {
        return Err("Proposal must be approved by CFO first!".to_string());
    }

    restaurant_proposal_repository::update_new_restaurant_proposal(
        state,
        id,
        existing_proposal.cfo_approved,
        existing_proposal.cfo_done,
        approve,
        1,
    )
    .await
}

pub async fn get_cfo_approved_restaurant_proposals(
    state: &State<'_, AppState>,
) -> Result<Vec<NewRestaurantProposalModel>, String> {
    restaurant_proposal_repository::get_cfo_approved_restaurant_proposals(state).await
}
