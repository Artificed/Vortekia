use crate::handlers::ride_queue_handler;
use crate::models::ride_queue::Model as RideQueueModel;
use crate::modules::app_state::AppState;
use crate::viewmodels::ride_with_queue::RideWithQueue;

use chrono::NaiveDateTime;
use tauri::State;

#[tauri::command]
pub async fn insert_ride_queue(
    state: State<'_, AppState>,
    ride_id: &str,
    customer_id: &str,
    start_time: NaiveDateTime,
    end_time: NaiveDateTime,
) -> Result<(), String> {
    ride_queue_handler::insert_ride_queue(&state, ride_id, customer_id, start_time, end_time).await
}

#[tauri::command]
pub async fn get_all_ride_queues(
    state: State<'_, AppState>,
) -> Result<Vec<RideQueueModel>, String> {
    ride_queue_handler::get_all_ride_queues(&state).await
}

#[tauri::command]
pub async fn get_ride_queue(
    state: State<'_, AppState>,
    id: &str,
) -> Result<RideQueueModel, String> {
    ride_queue_handler::get_ride_queue(&state, id).await
}

#[tauri::command]
pub async fn get_ride_queues_by_ride(
    state: State<'_, AppState>,
    ride_id: &str,
) -> Result<Vec<RideQueueModel>, String> {
    ride_queue_handler::get_ride_queues_by_ride(&state, ride_id).await
}

#[tauri::command]
pub async fn get_ride_queues_by_customer(
    state: State<'_, AppState>,
    customer_id: &str,
) -> Result<Vec<RideQueueModel>, String> {
    ride_queue_handler::get_ride_queues_by_customer(&state, customer_id).await
}

#[tauri::command]
pub async fn update_ride_queue(
    state: State<'_, AppState>,
    id: &str,
    ride_id: &str,
    customer_id: &str,
    start_time: String,
    end_time: String,
) -> Result<(), String> {
    ride_queue_handler::update_ride_queue(&state, id, ride_id, customer_id, start_time, end_time)
        .await
}

#[tauri::command]
pub async fn get_ride_with_queue(
    state: State<'_, AppState>,
    ride_id: &str,
) -> Result<RideWithQueue, String> {
    ride_queue_handler::get_ride_with_queue(&state, ride_id).await
}

#[tauri::command]
pub async fn get_all_rides_with_queues(
    state: State<'_, AppState>,
) -> Result<Vec<RideWithQueue>, String> {
    ride_queue_handler::get_all_rides_with_queues(&state).await
}

#[tauri::command]
pub async fn delete_ride_queue(state: State<'_, AppState>, id: &str) -> Result<(), String> {
    ride_queue_handler::delete_ride_queue(&state, id).await
}
