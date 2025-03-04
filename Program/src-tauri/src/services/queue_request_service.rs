use tauri::State;

use crate::handlers::queue_request_handler;

use crate::models::queue_request::Model as QueueRequestModel;
use crate::modules::app_state::AppState;

#[tauri::command]
pub async fn insert_new_queue_request(
    state: State<'_, AppState>,
    ride_id: String,
    customer_id: String,
) -> Result<(), String> {
    queue_request_handler::insert_new_queue_request(&state, ride_id, customer_id).await
}

#[tauri::command]
pub async fn get_all_queue_requests(
    state: State<'_, AppState>,
) -> Result<Vec<QueueRequestModel>, String> {
    queue_request_handler::get_all_queue_requests(&state).await
}

#[tauri::command]
pub async fn get_queue_requests_by_ride(
    state: State<'_, AppState>,
    ride_id: &str,
) -> Result<Vec<QueueRequestModel>, String> {
    queue_request_handler::get_queue_requests_by_ride(&state, ride_id).await
}
