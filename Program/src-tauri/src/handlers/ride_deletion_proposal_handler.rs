use tauri::State;

use crate::repositories::ride_repository;
use crate::{
    factories::ride_deletion_proposal_factory, modules::app_state::AppState,
    repositories::ride_deletion_proposal_repository,
};

use crate::models::ride_deletion_proposal::Model as RideDeletionProposalModel;

pub async fn insert_new_ride_deletion_proposal(
    state: &State<'_, AppState>,
    ride_id: String,
    reason: String,
) -> Result<(), String> {
    if ride_id.is_empty() {
        return Err("Ride ID is required!".to_string());
    }
    if reason.is_empty() {
        return Err("Reason for deletion is required!".to_string());
    }

    let proposal = ride_deletion_proposal_factory::create_ride_proposal(ride_id, reason);
    ride_deletion_proposal_repository::insert_ride_deletion_proposal(state, proposal).await
}

pub async fn get_all_ride_deletion_proposals(
    state: &State<'_, AppState>,
) -> Result<Vec<RideDeletionProposalModel>, String> {
    ride_deletion_proposal_repository::get_all_ride_deletion_proposals(state).await
}

pub async fn update_ride_deletion_proposal_approval(
    state: &State<'_, AppState>,
    id: String,
    approve: i8,
) -> Result<(), String> {
    let ride_id = ride_deletion_proposal_repository::update_ride_deletion_proposal_approval(
        state, &id, approve,
    )
    .await
    .unwrap();

    if approve == 1 {
        ride_repository::delete_ride(state, &ride_id).await?;
    }

    Ok(())
}
