use sea_orm::ActiveModelTrait;
use sea_orm::ActiveValue;
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

pub async fn update_store_deletion_proposal_approval(
    state: &State<'_, AppState>,
    id: &str,
    approve: i8,
) -> Result<String, String> {
    let proposal = StoreDeletionProposals::find()
        .filter(StoreDeletionProposalColumn::Id.eq(id))
        .one(&state.conn)
        .await;

    match proposal {
        Ok(Some(proposal)) => {
            let mut proposal_active: StoreDeletionProposalActiveModel = proposal.clone().into();
            let store_id = proposal.store_id;

            proposal_active.approved = ActiveValue::Set(approve);
            proposal_active.done = ActiveValue::Set(1);

            let result = proposal_active.update(&state.conn).await;

            match result {
                Ok(_) => Ok(store_id),
                Err(err) => {
                    eprintln!(
                        "Failed to update store deletion proposal approval status: {:?}",
                        err
                    );
                    Err(format!(
                        "Failed to update store deletion proposal approval status: {:?}",
                        err
                    ))
                }
            }
        }
        Ok(None) => Err(format!("Store deletion proposal with ID {} not found", id)),
        Err(err) => {
            eprintln!("Failed to find store deletion proposal: {:?}", err);
            Err(format!("Failed to find store deletion proposal: {:?}", err))
        }
    }
}
