use sea_orm::EntityTrait;
use tauri::State;

use super::customer_repository::AppState;
use crate::models::new_ride_proposal::ActiveModel as NewRideProposalActiveModel;
use crate::models::new_ride_proposal::Entity as NewRideProposals;

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
