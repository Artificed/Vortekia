use tauri::State;

use crate::handlers::ride_handler;
use crate::modules::app_state::AppState;

use crate::models::ride::Model as RideModel;
use crate::repositories::ride_repository;

#[tauri::command]
pub async fn get_all_rides(state: State<'_, AppState>) -> Result<Vec<RideModel>, String> {
    ride_repository::get_all_rides(&state).await
}

#[tauri::command]
pub async fn update_ride(
    state: State<'_, AppState>,
    image: &str,
    name: &str,
    id: &str,
    price: i32,
    status: &str,
    opening_time: &str,
    closing_time: &str,
    assigned_staff: &str,
) -> Result<(), String> {
    ride_handler::update_ride(
        &state,
        id,
        image,
        name,
        price,
        status,
        opening_time,
        closing_time,
        assigned_staff,
    )
    .await
}
