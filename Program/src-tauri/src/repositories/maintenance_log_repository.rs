use sea_orm::{ActiveModelTrait, ActiveValue, ColumnTrait, EntityTrait, QueryFilter};
use tauri::State;

use crate::models::maintenance_log::{
    ActiveModel as MaintenanceLogActiveModel, Column as MaintenanceLogColumn,
    Entity as MaintenanceLogs, Model as MaintenanceLogModel,
};
use crate::modules::app_state::AppState;

pub async fn insert_maintenance_log(
    state: &State<'_, AppState>,
    log: MaintenanceLogActiveModel,
) -> Result<(), String> {
    let result = MaintenanceLogs::insert(log).exec(&state.conn).await;
    match result {
        Ok(_) => Ok(()),
        Err(err) => {
            eprintln!("Failed to insert maintenance log: {:?}", err);
            Err(format!("Failed to insert maintenance log: {:?}", err))
        }
    }
}

pub async fn get_all_maintenance_logs(
    state: &State<'_, AppState>,
) -> Result<Vec<MaintenanceLogModel>, String> {
    let result = MaintenanceLogs::find().all(&state.conn).await;
    match result {
        Ok(logs) => Ok(logs),
        Err(err) => {
            eprintln!("Failed to get all maintenance logs: {:?}", err);
            Err(format!("Failed to get all maintenance logs: {:?}", err))
        }
    }
}

pub async fn get_maintenance_log_by_id(
    state: &State<'_, AppState>,
    id: &str,
) -> Result<MaintenanceLogModel, String> {
    let result = MaintenanceLogs::find()
        .filter(MaintenanceLogColumn::Id.eq(id.to_owned()))
        .one(&state.conn)
        .await;
    match result {
        Ok(Some(log)) => Ok(log),
        Ok(None) => Err(format!("Maintenance log with ID {} not found", id)),
        Err(err) => {
            eprintln!("Failed to get maintenance log: {:?}", err);
            Err(format!("Failed to get maintenance log: {:?}", err))
        }
    }
}

pub async fn update_maintenance_log(
    state: &State<'_, AppState>,
    log_id: String,
    approved: i8,
) -> Result<(), String> {
    let log = get_maintenance_log_by_id(state, &log_id).await?;

    let mut updated_log: MaintenanceLogActiveModel = log.into();
    updated_log.approved = ActiveValue::Set(approved);
    updated_log.done = ActiveValue::Set(1);

    let result = updated_log.update(&state.conn).await;
    match result {
        Ok(_) => Ok(()),
        Err(err) => {
            eprintln!("Failed to update maintenance log: {:?}", err);
            Err(format!("Failed to update maintenance log: {:?}", err))
        }
    }
}

pub async fn delete_maintenance_log(state: &State<'_, AppState>, id: &str) -> Result<(), String> {
    let result = MaintenanceLogs::delete_by_id(id.to_owned())
        .exec(&state.conn)
        .await;
    match result {
        Ok(delete_result) if delete_result.rows_affected > 0 => Ok(()),
        Ok(_) => Err(format!("Maintenance log with ID {} not found", id)),
        Err(err) => {
            eprintln!("Failed to delete maintenance log: {:?}", err);
            Err(format!("Failed to delete maintenance log: {:?}", err))
        }
    }
}
