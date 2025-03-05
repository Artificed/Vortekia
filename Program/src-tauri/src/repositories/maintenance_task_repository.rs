use sea_orm::{ActiveModelTrait, ActiveValue, ColumnTrait, EntityTrait, QueryFilter};
use tauri::State;

use crate::models::maintenance_task::{
    ActiveModel as MaintenanceTaskActiveModel, Column as MaintenanceTaskColumn,
    Entity as MaintenanceTasks, Model as MaintenanceTaskModel,
};
use crate::modules::app_state::AppState;

pub async fn insert_maintenance_task(
    state: &State<'_, AppState>,
    task: MaintenanceTaskActiveModel,
) -> Result<(), String> {
    let result = MaintenanceTasks::insert(task).exec(&state.conn).await;
    match result {
        Ok(_) => Ok(()),
        Err(err) => {
            eprintln!("Failed to insert maintenance task: {:?}", err);
            Err(format!("Failed to insert maintenance task: {:?}", err))
        }
    }
}

pub async fn get_all_maintenance_tasks(
    state: &State<'_, AppState>,
) -> Result<Vec<MaintenanceTaskModel>, String> {
    let result = MaintenanceTasks::find().all(&state.conn).await;
    match result {
        Ok(tasks) => Ok(tasks),
        Err(err) => {
            eprintln!("Failed to get all maintenance tasks: {:?}", err);
            Err(format!("Failed to get all maintenance tasks: {:?}", err))
        }
    }
}

pub async fn get_maintenance_task_by_staff(
    state: &State<'_, AppState>,
    staff_id: &str,
) -> Result<Vec<MaintenanceTaskModel>, String> {
    let result = MaintenanceTasks::find()
        .filter(MaintenanceTaskColumn::AssignedStaff.eq(staff_id.to_owned()))
        .all(&state.conn)
        .await;

    match result {
        Ok(tasks) => Ok(tasks),
        Err(err) => {
            eprintln!(
                "Failed to get maintenance tasks for staff {}: {:?}",
                staff_id, err
            );
            Err(format!(
                "Failed to get maintenance tasks for staff {}: {:?}",
                staff_id, err
            ))
        }
    }
}

pub async fn get_maintenance_task_by_id(
    state: &State<'_, AppState>,
    id: &str,
) -> Result<MaintenanceTaskModel, String> {
    let result = MaintenanceTasks::find()
        .filter(MaintenanceTaskColumn::Id.eq(id.to_owned()))
        .one(&state.conn)
        .await;
    match result {
        Ok(Some(task)) => Ok(task),
        Ok(None) => Err(format!("Maintenance task with ID {} not found", id)),
        Err(err) => {
            eprintln!("Failed to get maintenance task: {:?}", err);
            Err(format!("Failed to get maintenance task: {:?}", err))
        }
    }
}

pub async fn update_maintenance_task(
    state: &State<'_, AppState>,
    mut task: MaintenanceTaskActiveModel,
    name: String,
    description: String,
    assigned_staff: String,
    status: String,
) -> Result<(), String> {
    task.name = ActiveValue::Set(name);
    task.description = ActiveValue::Set(description);
    task.assigned_staff = ActiveValue::Set(assigned_staff);
    task.status = ActiveValue::Set(status);
    let result = task.update(&state.conn).await;
    match result {
        Ok(_) => Ok(()),
        Err(err) => {
            eprintln!("Failed to update maintenance task: {:?}", err);
            Err(format!("Failed to update maintenance task: {:?}", err))
        }
    }
}

pub async fn delete_maintenance_task(state: &State<'_, AppState>, id: &str) -> Result<(), String> {
    let result = MaintenanceTasks::delete_by_id(id.to_owned())
        .exec(&state.conn)
        .await;
    match result {
        Ok(delete_result) if delete_result.rows_affected > 0 => Ok(()),
        Ok(_) => Err(format!("Maintenance task with ID {} not found", id)),
        Err(err) => {
            eprintln!("Failed to delete maintenance task: {:?}", err);
            Err(format!("Failed to delete maintenance task: {:?}", err))
        }
    }
}
