use crate::factories::maintenance_log_factory;
use crate::models::maintenance_log::Model as MaintenanceLogModel;
use crate::modules::app_state::AppState;
use crate::repositories::maintenance_log_repository;
use tauri::State;

pub async fn insert_new_maintenance_log(
    state: &State<'_, AppState>,
    id: String,
    task_id: String,
    message: String,
) -> Result<(), String> {
    let log = maintenance_log_factory::create_maintenance_log(id, task_id, message);
    maintenance_log_repository::insert_maintenance_log(state, log).await
}

pub async fn get_all_maintenance_logs(
    state: &State<'_, AppState>,
) -> Result<Vec<MaintenanceLogModel>, String> {
    maintenance_log_repository::get_all_maintenance_logs(state).await
}

pub async fn get_maintenance_log_by_id(
    state: &State<'_, AppState>,
    id: String,
) -> Result<MaintenanceLogModel, String> {
    maintenance_log_repository::get_maintenance_log_by_id(state, &id).await
}

// pub async fn update_maintenance_log(
//     state: &State<'_, AppState>,
//     log: MaintenanceLogModel,
//     message: String,
//     approved: i8,
//     done: i8,
// ) -> Result<(), String> {
//     maintenance_log_repository::update_maintenance_log(state, log.into(), message, approved, done)
//         .await
// }

pub async fn delete_maintenance_log(state: &State<'_, AppState>, id: String) -> Result<(), String> {
    maintenance_log_repository::delete_maintenance_log(state, &id).await
}
