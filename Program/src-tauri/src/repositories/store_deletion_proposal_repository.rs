use sea_orm::ColumnTrait;
use sea_orm::EntityTrait;
use sea_orm::QueryFilter;
use tauri::State;

use super::customer_repository::AppState;
use crate::models::store_deletion_proposal::ActiveModel as StoreDeletionProposalActiveModel;
use crate::models::store_deletion_proposal::Column as StoreDeletionProposalColumn;
use crate::models::store_deletion_proposal::Entity as StoreDeletionProposals;
use crate::models::store_deletion_proposal::Model as StoreDeletionProposalModel;

pub async fn insert_delete_store_proposal(
    state: &State<'_, AppState>,
    delete_store_proposal: StoreDeletionProposalActiveModel,
) -> Result<(), String> {
    let result = StoreDeletionProposals::insert(delete_store_proposal)
        .exec(&state.conn)
        .await;
    match result {
        Ok(_) => Ok(()),
        Err(err) => {
            eprintln!("Failed to insert delete store proposal: {:?}", err);
            Err(format!("Failed to insert delete store proposal: {:?}", err))
        }
    }
}

pub async fn get_all_delete_store_proposals(
    state: &State<'_, AppState>,
) -> Result<Vec<StoreDeletionProposalModel>, String> {
    let result = StoreDeletionProposals::find().all(&state.conn).await;
    match result {
        Ok(proposals) => Ok(proposals),
        Err(err) => {
            eprintln!("Failed to get all delete store proposals: {:?}", err);
            Err(format!(
                "Failed to get all delete store proposals: {:?}",
                err
            ))
        }
    }
}

pub async fn get_delete_store_proposal(
    state: &State<'_, AppState>,
    id: &str,
) -> Result<StoreDeletionProposalModel, String> {
    let result = StoreDeletionProposals::find()
        .filter(StoreDeletionProposalColumn::Id.eq(id.to_owned()))
        .one(&state.conn)
        .await;
    match result {
        Ok(Some(proposal)) => Ok(proposal),
        Ok(None) => Err(format!("Delete store proposal with ID {} not found", id)),
        Err(err) => {
            eprintln!("Failed to get delete store proposal: {:?}", err);
            Err(format!("Failed to get delete store proposal: {:?}", err))
        }
    }
}
