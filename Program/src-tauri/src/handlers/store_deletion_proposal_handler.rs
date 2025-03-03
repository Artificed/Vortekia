use tauri::State;

use crate::factories::store_deletion_proposal_factory;
use crate::models::store_deletion_proposal::Model as StoreDeletionProposalModel;
use crate::modules::app_state::AppState;
use crate::repositories::{store_deletion_proposal_repository, store_repository};

pub async fn insert_store_deletion_proposal(
    state: &State<'_, AppState>,
    store_id: String,
    reason: String,
) -> Result<(), String> {
    let proposal = store_deletion_proposal_factory::create_delete_store_proposal(store_id, reason);
    store_deletion_proposal_repository::insert_delete_store_proposal(state, proposal).await
}

pub async fn get_all_store_deletion_proposals(
    state: &State<'_, AppState>,
) -> Result<Vec<StoreDeletionProposalModel>, String> {
    store_deletion_proposal_repository::get_all_delete_store_proposals(state).await
}

pub async fn update_store_deletion_proposal_approval(
    state: &State<'_, AppState>,
    id: String,
    approve: i8,
) -> Result<(), String> {
    let store_id = store_deletion_proposal_repository::update_store_deletion_proposal_approval(
        state, &id, approve,
    )
    .await
    .unwrap();

    if approve == 1 {
        store_repository::delete_store(state, &store_id).await?;
    }

    Ok(())
}
