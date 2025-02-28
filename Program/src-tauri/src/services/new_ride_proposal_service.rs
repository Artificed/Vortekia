use tauri::State;

use crate::{handlers::new_ride_proposal_handler, modules::app_state::AppState};

#[tauri::command]
pub async fn insert_new_ride_proposal(
    state: State<'_, AppState>,
    ride_name: String,
    cost_review: String,
    image: String,
    image_bytes: &[u8],
) -> Result<(), String> {
    new_ride_proposal_handler::insert_new_ride_proposal(
        state,
        ride_name,
        cost_review,
        image,
        image_bytes,
    )
    .await
}
