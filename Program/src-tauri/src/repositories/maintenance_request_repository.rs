use sea_orm::{ActiveModelTrait, ActiveValue, ColumnTrait, EntityTrait, QueryFilter};
use tauri::State;

use crate::models::maintenance_request::{
    ActiveModel as MaintenanceRequestActiveModel, Column as MaintenanceRequestColumn,
    Entity as MaintenanceRequests, Model as MaintenanceRequestModel,
};
use crate::modules::app_state::AppState;

pub async fn insert_maintenance_request(
    state: &State<'_, AppState>,
    request: MaintenanceRequestActiveModel,
) -> Result<(), String> {
    let result = MaintenanceRequests::insert(request).exec(&state.conn).await;
    match result {
        Ok(_) => Ok(()),
        Err(err) => {
            eprintln!("Failed to insert maintenance request: {:?}", err);
            Err(format!("Failed to insert maintenance request: {:?}", err))
        }
    }
}

pub async fn get_all_maintenance_requests(
    state: &State<'_, AppState>,
) -> Result<Vec<MaintenanceRequestModel>, String> {
    let result = MaintenanceRequests::find().all(&state.conn).await;
    match result {
        Ok(requests) => Ok(requests),
        Err(err) => {
            eprintln!("Failed to get all maintenance requests: {:?}", err);
            Err(format!("Failed to get all maintenance requests: {:?}", err))
        }
    }
}

pub async fn get_maintenance_request_by_id(
    state: &State<'_, AppState>,
    id: &str,
) -> Result<MaintenanceRequestModel, String> {
    let result = MaintenanceRequests::find()
        .filter(MaintenanceRequestColumn::Id.eq(id.to_owned()))
        .one(&state.conn)
        .await;
    match result {
        Ok(Some(request)) => Ok(request),
        Ok(None) => Err(format!("Maintenance request with ID {} not found", id)),
        Err(err) => {
            eprintln!("Failed to get maintenance request: {:?}", err);
            Err(format!("Failed to get maintenance request: {:?}", err))
        }
    }
}

pub async fn update_maintenance_request(
    state: &State<'_, AppState>,
    mut request: MaintenanceRequestActiveModel,
    title: String,
    content: String,
) -> Result<(), String> {
    request.title = ActiveValue::Set(title);
    request.content = ActiveValue::Set(content);
    let result = request.update(&state.conn).await;
    match result {
        Ok(_) => Ok(()),
        Err(err) => {
            eprintln!("Failed to update maintenance request: {:?}", err);
            Err(format!("Failed to update maintenance request: {:?}", err))
        }
    }
}

pub async fn delete_maintenance_request(
    state: &State<'_, AppState>,
    id: &str,
) -> Result<(), String> {
    let result = MaintenanceRequests::delete_by_id(id.to_owned())
        .exec(&state.conn)
        .await;
    match result {
        Ok(delete_result) if delete_result.rows_affected > 0 => Ok(()),
        Ok(_) => Err(format!("Maintenance request with ID {} not found", id)),
        Err(err) => {
            eprintln!("Failed to delete maintenance request: {:?}", err);
            Err(format!("Failed to delete maintenance request: {:?}", err))
        }
    }
}
