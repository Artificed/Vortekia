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
