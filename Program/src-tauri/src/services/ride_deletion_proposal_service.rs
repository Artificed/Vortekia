use tauri::State;

use crate::models::ride_deletion_proposal::Model as RideDeletionProposalModel;
use crate::{handlers::ride_deletion_proposal_handler, modules::app_state::AppState};

#[tauri::command]
pub async fn insert_ride_deletion_proposal(
    state: State<'_, AppState>,
    ride_id: String,
    reason: String,
) -> Result<(), String> {
    ride_deletion_proposal_handler::insert_new_ride_deletion_proposal(&state, ride_id, reason).await
}

#[tauri::command]
pub async fn get_all_ride_deletion_proposals(
    state: State<'_, AppState>,
) -> Result<Vec<RideDeletionProposalModel>, String> {
    ride_deletion_proposal_handler::get_all_ride_deletion_proposals(&state).await
}

#[tauri::command]
pub async fn update_ride_deletion_proposal_approval(
    state: State<'_, AppState>,
    id: String,
    approve: i8,
) -> Result<(), String> {
    ride_deletion_proposal_handler::update_ride_deletion_proposal_approval(&state, id, approve)
        .await
}
