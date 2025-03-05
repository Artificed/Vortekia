use crate::factories::{id_factory, maintenance_task_factory};
use crate::models::maintenance_task::Model as MaintenanceTaskModel;
use crate::modules::app_state::AppState;
use crate::repositories::maintenance_task_repository;
use chrono::NaiveDateTime;
use tauri::State;

pub async fn insert_new_maintenance_task(
    state: &State<'_, AppState>,
    name: String,
    description: String,
    start_time: String,
    end_time: String,
    assigned_staff: String,
    status: String,
) -> Result<(), String> {
    let start = NaiveDateTime::parse_from_str(&start_time, "%Y-%m-%d %H:%M:%S")
        .map_err(|e| format!("Failed to parse start_time: {}", e))?;

    let end = NaiveDateTime::parse_from_str(&end_time, "%Y-%m-%d %H:%M:%S")
        .map_err(|e| format!("Failed to parse end_time: {}", e))?;

    let tasks = maintenance_task_repository::get_all_maintenance_tasks(state).await?;
    for task in tasks.iter() {
        if task.assigned_staff == assigned_staff && start < task.end_time && task.start_time < end {
            return Err(
                "Schedule conflict: The assigned staff already has a task during this time period."
                    .into(),
            );
        }
    }

    let id = id_factory::generate_customer_id();

    let task = maintenance_task_factory::create_maintenance_task(
        id,
        name.clone(),
        description,
        assigned_staff.clone(),
        start,
        end,
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
