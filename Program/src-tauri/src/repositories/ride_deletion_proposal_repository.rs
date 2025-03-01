use sea_orm::ActiveModelTrait;
use tauri::State;

use crate::models::ride_deletion_proposal::ActiveModel as RideDeletionProposalActiveModel;
use crate::models::ride_deletion_proposal::Column as RideDeletionProposalColumn;
use crate::models::ride_deletion_proposal::Entity as RideDeletionProposals;
use crate::models::ride_deletion_proposal::Model as RideDeletionProposalModel;
use crate::modules::app_state::AppState;
use sea_orm::ActiveValue::Set;
use sea_orm::{ColumnTrait, EntityTrait, QueryFilter};

pub async fn insert_ride_deletion_proposal(
    state: &State<'_, AppState>,
    ride_deletion_proposal: RideDeletionProposalActiveModel,
) -> Result<(), String> {
    let result = RideDeletionProposals::insert(ride_deletion_proposal)
        .exec(&state.conn)
        .await;

    match result {
        Ok(_) => Ok(()),
        Err(err) => {
            eprintln!("Failed to insert ride deletion proposal: {:?}", err);
            Err(format!(
                "Failed to insert ride deletion proposal: {:?}",
                err
            ))
        }
    }
}

pub async fn get_all_ride_deletion_proposals(
    state: &State<'_, AppState>,
) -> Result<Vec<RideDeletionProposalModel>, String> {
    let result = RideDeletionProposals::find().all(&state.conn).await;

    match result {
        Ok(proposals) => Ok(proposals),
        Err(err) => {
            eprintln!("Failed to get all ride deletion proposals: {:?}", err);
            Err(format!(
                "Failed to get all ride deletion proposals: {:?}",
                err
            ))
        }
    }
}

pub async fn get_ride_deletion_proposal(
    state: &AppState,
    id: &str,
) -> Result<RideDeletionProposalModel, String> {
    let result = RideDeletionProposals::find()
        .filter(RideDeletionProposalColumn::Id.eq(id.to_owned()))
        .one(&state.conn)
        .await;

    match result {
        Ok(Some(proposal)) => Ok(proposal),
        Ok(None) => Err(format!("Ride deletion proposal with ID {} not found", id)),
        Err(err) => {
            eprintln!("Failed to get ride deletion proposal: {:?}", err);
            Err(format!("Failed to get ride deletion proposal: {:?}", err))
        }
    }
}

pub async fn update_ride_deletion_proposal_approval(
    state: &State<'_, AppState>,
    id: &str,
    approve: i8,
) -> Result<(), String> {
    let proposal = RideDeletionProposals::find()
        .filter(RideDeletionProposalColumn::Id.eq(id))
        .one(&state.conn)
        .await;

    match proposal {
        Ok(Some(proposal)) => {
            let mut proposal_active: RideDeletionProposalActiveModel = proposal.into();

            proposal_active.approved = Set(approve);
            proposal_active.done = Set(1);

            let result = proposal_active.update(&state.conn).await;

            match result {
                Ok(_) => Ok(()),
                Err(err) => {
                    eprintln!(
                        "Failed to update ride deletion proposal approval status: {:?}",
                        err
                    );
                    Err(format!(
                        "Failed to update ride deletion proposal approval status: {:?}",
                        err
                    ))
                }
            }
        }
        Ok(None) => Err(format!("Ride deletion proposal with ID {} not found", id)),
        Err(err) => {
            eprintln!("Failed to find ride deletion proposal: {:?}", err);
            Err(format!("Failed to find ride deletion proposal: {:?}", err))
        }
    }
}
