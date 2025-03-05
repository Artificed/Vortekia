use tauri::State;

use crate::models::maintenance_log::Model as MaintenanceLogModel;
use crate::{handlers::maintenance_log_handler, modules::app_state::AppState};

#[tauri::command]
pub async fn insert_new_maintenance_log(
    state: State<'_, AppState>,
    task_id: String,
    message: String,
) -> Result<(), String> {
    maintenance_log_handler::insert_new_maintenance_log(&state, task_id, message).await
}

#[tauri::command]
pub async fn get_all_maintenance_logs(
    state: State<'_, AppState>,
) -> Result<Vec<MaintenanceLogModel>, String> {
    maintenance_log_handler::get_all_maintenance_logs(&state).await
}

#[tauri::command]
pub async fn update_maintenance_log(
    state: State<'_, AppState>,
    log_id: String,
    approved: i8,
) -> Result<(), String> {
    maintenance_log_handler::update_maintenance_log(&state, log_id, approved).await
}
