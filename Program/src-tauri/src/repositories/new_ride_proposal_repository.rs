use sea_orm::ActiveModelTrait;
use tauri::State;

use crate::models::new_ride_proposal::ActiveModel as NewRideProposalActiveModel;
use crate::models::new_ride_proposal::Column as NewRideProposalColumn;
use crate::models::new_ride_proposal::Entity as NewRideProposals;
use crate::models::new_ride_proposal::Model as NewRideProposalModel;
use crate::modules::app_state::AppState;
use sea_orm::ActiveValue::Set;
use sea_orm::{ColumnTrait, EntityTrait, QueryFilter};

pub async fn insert_new_ride_proposal(
    state: State<'_, AppState>,
    new_ride_proposal: NewRideProposalActiveModel,
) -> Result<(), String> {
    let result = NewRideProposals::insert(new_ride_proposal)
        .exec(&state.conn)
        .await;

    match result {
        Ok(_) => Ok(()),
        Err(err) => {
            eprintln!("Failed to insert new ride proposal: {:?}", err);
            Err(format!("Failed to insert new ride proposal: {:?}", err))
        }
    }
}

pub async fn get_all_new_ride_proposals(
    state: State<'_, AppState>,
) -> Result<Vec<NewRideProposalModel>, String> {
    let result = NewRideProposals::find().all(&state.conn).await;

    match result {
        Ok(proposals) => Ok(proposals),
        Err(err) => {
            eprintln!("Failed to get all new ride proposals: {:?}", err);
            Err(format!("Failed to get all new ride proposals: {:?}", err))
        }
    }
}

pub async fn get_ride_proposal(state: &AppState, id: &str) -> Result<NewRideProposalModel, String> {
    let result = NewRideProposals::find()
        .filter(NewRideProposalColumn::Id.eq(id.to_owned()))
        .one(&state.conn)
        .await;

    match result {
        Ok(Some(proposal)) => Ok(proposal),
        Ok(None) => Err(format!("Ride proposal with ID {} not found", id)),
        Err(err) => {
            eprintln!("Failed to get ride proposal: {:?}", err);
            Err(format!("Failed to get ride proposal: {:?}", err))
        }
    }
}

pub async fn update_new_ride_proposal_approval(
    state: &State<'_, AppState>,
    id: &str,
    approve: i8,
) -> Result<(), String> {
    let proposal = NewRideProposals::find()
        .filter(NewRideProposalColumn::Id.eq(id))
        .one(&state.conn)
        .await;

    match proposal {
        Ok(Some(proposal)) => {
            let mut proposal_active: NewRideProposalActiveModel = proposal.into();

            proposal_active.approved = Set(approve);
            proposal_active.done = Set(1);

            let result = proposal_active.update(&state.conn).await;

            match result {
                Ok(_) => Ok(()),
                Err(err) => {
                    eprintln!("Failed to update ride proposal approval status: {:?}", err);
                    Err(format!(
                        "Failed to update ride proposal approval status: {:?}",
                        err
                    ))
                }
            }
        }
        Ok(None) => Err(format!("Ride proposal with ID {} not found", id)),
        Err(err) => {
            eprintln!("Failed to find ride proposal: {:?}", err);
            Err(format!("Failed to find ride proposal: {:?}", err))
        }
    }
}
