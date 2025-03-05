use tauri::State;

use crate::models::maintenance_request::Model as MaintenanceRequestModel;
use crate::{handlers::maintenance_request_handler, modules::app_state::AppState};

#[tauri::command]
pub async fn insert_new_maintenance_request(
    state: State<'_, AppState>,
    title: String,
    content: String,
) -> Result<(), String> {
    maintenance_request_handler::insert_new_maintenance_request(&state, title, content).await
}

#[tauri::command]
pub async fn get_all_maintenance_requests(
    state: State<'_, AppState>,
) -> Result<Vec<MaintenanceRequestModel>, String> {
    maintenance_request_handler::get_all_maintenance_requests(&state).await
}

#[tauri::command]
pub async fn update_maintenance_request(
    state: State<'_, AppState>,
    request_id: String,
    approved: i8,
    description: String,
    start_time: String,
    end_time: String,
    assigned_staff: String,
) -> Result<(), String> {
    maintenance_request_handler::update_maintenance_request(
        &state,
        request_id,
        approved,
        description,
        start_time,
        end_time,
        assigned_staff,
    )
    .await
}
