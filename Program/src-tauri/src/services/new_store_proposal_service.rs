use tauri::State;

use crate::handlers::new_store_proposal_handler;
use crate::models::new_store_proposal::Model as NewStoreProposalModel;
use crate::modules::app_state::AppState;

#[tauri::command]
pub async fn insert_new_store_proposal(
    state: State<'_, AppState>,
    store_name: String,
    store_description: String,
    reason: String,
    image: String,
    image_bytes: Vec<u8>,
) -> Result<(), String> {
    new_store_proposal_handler::insert_new_store_proposal(
        &state,
        store_name,
        store_description,
        reason,
        image,
        image_bytes,
    )
    .await
}

#[tauri::command]
pub async fn get_all_new_store_proposals(
    state: State<'_, AppState>,
) -> Result<Vec<NewStoreProposalModel>, String> {
    new_store_proposal_handler::get_all_new_store_proposals(&state).await
}

#[tauri::command]
pub async fn update_new_store_proposal_approval(
    state: State<'_, AppState>,
    id: String,
    approve: i8,
    opening_time: String,
    closing_time: String,
) -> Result<(), String> {
    new_store_proposal_handler::update_new_store_proposal_approval(
        state,
        id,
        approve,
        opening_time,
        closing_time,
    )
    .await
}
