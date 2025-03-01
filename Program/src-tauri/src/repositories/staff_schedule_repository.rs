use sea_orm::{ColumnTrait, EntityTrait, QueryFilter};
use tauri::State;

use crate::models::staff_schedule::ActiveModel as StaffScheduleActiveModel;
use crate::models::staff_schedule::Column as StaffScheduleColumn;
use crate::models::staff_schedule::Entity as StaffSchedules;
use crate::models::staff_schedule::Model as StaffScheduleModel;

use super::customer_repository::AppState;

pub async fn get_staff_schedule_from_id(
    state: &State<'_, AppState>,
    id: &str,
) -> Result<Option<StaffScheduleModel>, String> {
    let result = StaffSchedules::find()
        .filter(StaffScheduleColumn::Id.eq(id))
        .one(&state.conn)
        .await;

    match result {
        Ok(schedule) => Ok(schedule),
        Err(_) => Err("Failed to get staff schedule!".to_string()),
    }
}

pub async fn get_staff_schedule_from_staff_id(
    state: &State<'_, AppState>,
    staff_id: &str,
) -> Result<Vec<StaffScheduleModel>, String> {
    let result = StaffSchedules::find()
        .filter(StaffScheduleColumn::StaffId.eq(staff_id))
        .all(&state.conn)
        .await;

    match result {
        Ok(schedules) => Ok(schedules),
        Err(err) => {
            eprintln!(
                "Error getting staff schedules for staff ID {}: {:?}",
                staff_id, err
            );
            Err(format!(
                "Failed to get staff schedules for staff ID {}",
                staff_id
            ))
        }
    }
}

pub async fn insert_staff_schedule(
    state: &State<'_, AppState>,
    schedule: StaffScheduleActiveModel,
) -> Result<(), String> {
    let result = StaffSchedules::insert(schedule).exec(&state.conn).await;

    if result.is_ok() {
        Ok(())
    } else {
        Err("Failed to insert staff schedule".to_string())
    }
}

pub async fn delete_staff_schedule(state: &State<'_, AppState>, id: &str) -> Result<(), String> {
    let result = StaffSchedules::delete_by_id(id).exec(&state.conn).await;

    if result.is_ok() {
        Ok(())
    } else {
        Err("Failed to delete staff schedule".to_string())
    }
}
