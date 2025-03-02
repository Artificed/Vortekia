use crate::models::new_store_proposal::ActiveModel as NewStoreProposalActiveModel;
use crate::models::new_store_proposal::Column as NewStoreProposalColumn;
use crate::models::new_store_proposal::Entity as NewStoreProposals;
use crate::models::new_store_proposal::Model as NewStoreProposalModel;
use crate::modules::app_state::AppState;
use sea_orm::ActiveModelTrait;
use sea_orm::ActiveValue::Set;
use sea_orm::{ColumnTrait, EntityTrait, QueryFilter};
use tauri::State;

pub async fn insert_new_store_proposal(
    state: &State<'_, AppState>,
    new_store_proposal: NewStoreProposalActiveModel,
) -> Result<(), String> {
    let result = NewStoreProposals::insert(new_store_proposal)
        .exec(&state.conn)
        .await;
    match result {
        Ok(_) => Ok(()),
        Err(err) => {
            eprintln!("Failed to insert new store proposal: {:?}", err);
            Err(format!("Failed to insert new store proposal: {:?}", err))
        }
    }
}

pub async fn get_all_new_store_proposals(
    state: &State<'_, AppState>,
) -> Result<Vec<NewStoreProposalModel>, String> {
    let result = NewStoreProposals::find().all(&state.conn).await;
    match result {
        Ok(proposals) => Ok(proposals),
        Err(err) => {
            eprintln!("Failed to get all new store proposals: {:?}", err);
            Err(format!("Failed to get all new store proposals: {:?}", err))
        }
    }
}

pub async fn get_store_proposal(
    state: &State<'_, AppState>,
    id: &str,
) -> Result<NewStoreProposalModel, String> {
    let result = NewStoreProposals::find()
        .filter(NewStoreProposalColumn::Id.eq(id.to_owned()))
        .one(&state.conn)
        .await;
    match result {
        Ok(Some(proposal)) => Ok(proposal),
        Ok(None) => Err(format!("Store proposal with ID {} not found", id)),
        Err(err) => {
            eprintln!("Failed to get store proposal: {:?}", err);
            Err(format!("Failed to get store proposal: {:?}", err))
        }
    }
}

pub async fn update_new_store_proposal_approval(
    state: &State<'_, AppState>,
    id: &str,
    approve: i8,
) -> Result<(), String> {
    let proposal = NewStoreProposals::find()
        .filter(NewStoreProposalColumn::Id.eq(id))
        .one(&state.conn)
        .await;
    match proposal {
        Ok(Some(proposal)) => {
            let mut proposal_active: NewStoreProposalActiveModel = proposal.into();
            proposal_active.approved = Set(approve);
            proposal_active.done = Set(1);
            let result = proposal_active.update(&state.conn).await;
            match result {
                Ok(_) => Ok(()),
                Err(err) => {
                    eprintln!("Failed to update store proposal approval status: {:?}", err);
                    Err(format!(
                        "Failed to update store proposal approval status: {:?}",
                        err
                    ))
                }
            }
        }
        Ok(None) => Err(format!("Store proposal with ID {} not found", id)),
        Err(err) => {
            eprintln!("Failed to find store proposal: {:?}", err);
            Err(format!("Failed to find store proposal: {:?}", err))
        }
    }
}
