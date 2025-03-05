use tauri::State;

use crate::models::maintenance_task::Model as MaintenanceTaskModel;
use crate::{handlers::maintenance_task_handler, modules::app_state::AppState};

#[tauri::command]
pub async fn insert_new_maintenance_task(
    state: State<'_, AppState>,
    name: String,
    description: String,
    start_time: String,
    end_time: String,
    assigned_staff: String,
    status: String,
) -> Result<(), String> {
    maintenance_task_handler::insert_new_maintenance_task(
        &state,
        name,
        description,
        start_time,
        end_time,
        assigned_staff,
        status,
    )
    .await
}

#[tauri::command]
pub async fn get_all_maintenance_tasks(
    state: State<'_, AppState>,
) -> Result<Vec<MaintenanceTaskModel>, String> {
    maintenance_task_handler::get_all_maintenance_tasks(&state).await
}
