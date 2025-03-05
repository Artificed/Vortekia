use crate::factories::maintenance_task_factory;
use crate::models::maintenance_task::Model as MaintenanceTaskModel;
use crate::modules::app_state::AppState;
use crate::repositories::maintenance_task_repository;
use tauri::State;

pub async fn insert_new_maintenance_task(
    state: &State<'_, AppState>,
    id: String,
    name: String,
    description: String,
    assigned_staff: Option<String>,
    status: String,
) -> Result<(), String> {
    let task = maintenance_task_factory::create_maintenance_task(
        id,
        name,
        description,
        assigned_staff,
        status,
    );
    maintenance_task_repository::insert_maintenance_task(state, task).await
}

pub async fn get_all_maintenance_tasks(
    state: &State<'_, AppState>,
) -> Result<Vec<MaintenanceTaskModel>, String> {
    maintenance_task_repository::get_all_maintenance_tasks(state).await
}

pub async fn get_maintenance_task_by_id(
    state: &State<'_, AppState>,
    id: String,
) -> Result<MaintenanceTaskModel, String> {
    maintenance_task_repository::get_maintenance_task_by_id(state, &id).await
}

// pub async fn update_maintenance_task(
//     state: &State<'_, AppState>,
//     task: MaintenanceTaskModel,
//     name: String,
//     description: String,
//     assigned_staff: Option<String>,
//     status: String,
// ) -> Result<(), String> {
//     maintenance_task_repository::update_maintenance_task(
//         state,
//         task.into(),
//         name,
//         description,
//         assigned_staff,
//         status,
//     )
//     .await
// }

pub async fn delete_maintenance_task(
    state: &State<'_, AppState>,
    id: String,
) -> Result<(), String> {
    maintenance_task_repository::delete_maintenance_task(state, &id).await
}
