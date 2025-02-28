use tauri::State;

use crate::models::new_ride_proposal::Model as NewRideProposalModel;
use crate::{handlers::new_ride_proposal_handler, modules::app_state::AppState};

#[tauri::command]
pub async fn insert_new_ride_proposal(
    state: State<'_, AppState>,
    ride_name: String,
    cost_review: String,
    image: String,
    image_bytes: &[u8],
) -> Result<(), String> {
    new_ride_proposal_handler::insert_new_ride_proposal(
        state,
        ride_name,
        cost_review,
        image,
        image_bytes,
    )
    .await
}

#[tauri::command]
pub async fn get_new_ride_proposals(
    state: State<'_, AppState>,
) -> Result<Vec<NewRideProposalModel>, String> {
    new_ride_proposal_handler::get_all_new_ride_proposals(state).await
}

#[tauri::command]
pub async fn update_new_ride_proposal_approval(
    state: State<'_, AppState>,
    id: String,
    approve: i8,
) -> Result<(), String> {
    new_ride_proposal_handler::update_new_ride_proposal_approval(state, id, approve).await
}
