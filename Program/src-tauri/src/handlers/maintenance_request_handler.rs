use crate::factories::maintenance_request_factory;
use crate::models::maintenance_request::Model as MaintenanceRequestModel;
use crate::modules::app_state::AppState;
use crate::repositories::maintenance_request_repository;
use tauri::State;

use super::{maintenance_report_handler, maintenance_task_handler};

pub async fn insert_new_maintenance_request(
    state: &State<'_, AppState>,
    title: String,
    content: String,
) -> Result<(), String> {
    let request = maintenance_request_factory::create_maintenance_request(title, content);
    maintenance_request_repository::insert_maintenance_request(state, request).await
}

pub async fn get_all_maintenance_requests(
    state: &State<'_, AppState>,
) -> Result<Vec<MaintenanceRequestModel>, String> {
    maintenance_request_repository::get_all_maintenance_requests(state).await
}

pub async fn get_maintenance_request_by_id(
    state: &State<'_, AppState>,
    id: String,
) -> Result<MaintenanceRequestModel, String> {
    maintenance_request_repository::get_maintenance_request_by_id(state, &id).await
}

pub async fn update_maintenance_request(
    state: &State<'_, AppState>,
    request_id: String,
    approved: i8,
    description: String,
    start_time: String,
    end_time: String,
    assigned_staff: String,
) -> Result<(), String> {
    maintenance_request_repository::update_maintenance_request(state, request_id.clone(), approved)
        .await?;

    if approved == 1 {
        maintenance_task_handler::insert_new_maintenance_task(
            state,
            String::from("Ride Maintenance"),
            description,
            start_time,
            end_time,
            assigned_staff,
            String::from("Pending"),
        )
        .await
    } else {
        Ok(())
    }
}

pub async fn delete_maintenance_request(
    state: &State<'_, AppState>,
    id: String,
) -> Result<(), String> {
    maintenance_request_repository::delete_maintenance_request(state, &id).await
}
