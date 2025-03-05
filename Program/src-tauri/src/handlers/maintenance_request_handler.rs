use crate::factories::maintenance_request_factory;
use crate::models::maintenance_request::Model as MaintenanceRequestModel;
use crate::modules::app_state::AppState;
use crate::repositories::maintenance_request_repository;
use tauri::State;

pub async fn insert_new_maintenance_request(
    state: &State<'_, AppState>,
    id: String,
    title: String,
    content: String,
) -> Result<(), String> {
    let request = maintenance_request_factory::create_maintenance_request(id, title, content);
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
    request: MaintenanceRequestModel,
    title: String,
    content: String,
) -> Result<(), String> {
    maintenance_request_repository::update_maintenance_request(
        state,
        request.into(),
        title,
        content,
    )
    .await
}

pub async fn delete_maintenance_request(
    state: &State<'_, AppState>,
    id: String,
) -> Result<(), String> {
    maintenance_request_repository::delete_maintenance_request(state, &id).await
}
