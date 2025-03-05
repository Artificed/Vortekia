use tauri::State;

use crate::{handlers::maintenance_log_handler, modules::app_state::AppState};

#[tauri::command]
pub async fn insert_new_maintenance_log(
    state: State<'_, AppState>,
    task_id: String,
    message: String,
) -> Result<(), String> {
    maintenance_log_handler::insert_new_maintenance_log(&state, task_id, message).await
}
