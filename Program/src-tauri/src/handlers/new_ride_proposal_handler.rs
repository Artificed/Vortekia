use tauri::State;

use crate::{
    factories::new_ride_proposal_factory, modules::app_state::AppState,
    repositories::new_ride_proposal_repository,
};

use crate::models::new_ride_proposal::Model as NewRideProposalModel;

use super::file_handler;

pub async fn insert_new_ride_proposal(
    state: State<'_, AppState>,
    ride_name: String,
    cost_review: String,
    image: String,
    image_bytes: &[u8],
) -> Result<(), String> {
    let img_url_result = file_handler::upload_image_to_firebase(&image, image_bytes).await;

    match img_url_result {
        Ok(img_url) => {
            let proposal =
                new_ride_proposal_factory::create_ride_proposal(ride_name, cost_review, img_url);
            new_ride_proposal_repository::insert_new_ride_proposal(state, proposal).await
        }
        Err(err) => Err(format!("Failed to upload image: {}", err)),
    }
}

pub async fn get_all_new_ride_proposals(
    state: State<'_, AppState>,
) -> Result<Vec<NewRideProposalModel>, String> {
    new_ride_proposal_repository::get_all_new_ride_proposals(state).await
}
