use tauri::State;

use crate::handlers::store_deletion_proposal_handler;
use crate::models::store_deletion_proposal::Model as StoreDeletionProposalModel;
use crate::modules::app_state::AppState;

#[tauri::command]
pub async fn insert_store_deletion_proposal(
    state: State<'_, AppState>,
    store_id: String,
    reason: String,
) -> Result<(), String> {
    store_deletion_proposal_handler::insert_store_deletion_proposal(&state, store_id, reason).await
}

#[tauri::command]
pub async fn get_all_store_deletion_proposals(
    state: State<'_, AppState>,
) -> Result<Vec<StoreDeletionProposalModel>, String> {
    store_deletion_proposal_handler::get_all_store_deletion_proposals(&state).await
}

#[tauri::command]
pub async fn update_store_deletion_proposal_approval(
    state: State<'_, AppState>,
    id: String,
    approve: i8,
) -> Result<(), String> {
    store_deletion_proposal_handler::update_store_deletion_proposal_approval(&state, id, approve)
        .await
}
