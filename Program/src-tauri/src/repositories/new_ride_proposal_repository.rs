use sea_orm::ActiveModelTrait;
use sea_orm::EntityTrait;
use tauri::State;

use super::customer_repository::AppState;
use crate::models::new_ride_proposal::ActiveModel as NewRideProposalActiveModel;
use crate::models::new_ride_proposal::Entity as NewRideProposals;
use crate::models::new_ride_proposal::Model as NewRideProposalModel;

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

pub async fn update_new_ride_proposal_approval(
    state: State<'_, AppState>,
    id: String,
    approve: i8,
) -> Result<(), String> {
    use crate::models::new_ride_proposal::Column;
    use sea_orm::ActiveValue::Set;
    use sea_orm::{ColumnTrait, EntityTrait, QueryFilter};

    let proposal = NewRideProposals::find()
        .filter(Column::Id.eq(id.clone()))
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
