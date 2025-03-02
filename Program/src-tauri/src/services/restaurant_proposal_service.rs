use tauri::State;

use crate::models::new_restaurant_proposal::Model as NewRestaurantProposalModel;
use crate::{handlers::restaurant_proposal_handler, modules::app_state::AppState};

#[tauri::command]
pub async fn insert_new_restaurant_proposal(
    state: State<'_, AppState>,
    restaurant_name: String,
    opening_time: String,
    closing_time: String,
    cuisine_type: String,
    image: String,
    image_bytes: Vec<u8>,
) -> Result<(), String> {
    restaurant_proposal_handler::insert_new_restaurant_proposal(
        &state,
        restaurant_name,
        opening_time,
        closing_time,
        cuisine_type,
        image,
        image_bytes,
    )
    .await
}

#[tauri::command]
pub async fn get_all_new_restaurant_proposals(
    state: State<'_, AppState>,
) -> Result<Vec<NewRestaurantProposalModel>, String> {
    restaurant_proposal_handler::get_all_new_restaurant_proposals(&state).await
}

#[tauri::command]
pub async fn update_new_restaurant_proposal_cfo_approval(
    state: State<'_, AppState>,
    id: &str,
    approve: i8,
) -> Result<(), String> {
    restaurant_proposal_handler::update_new_restaurant_proposal_cfo_approval(&state, id, approve)
        .await
}
