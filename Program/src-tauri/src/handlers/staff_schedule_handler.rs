use tauri::State;

use crate::{
    factories::staff_schedule_factory, modules::app_state::AppState,
    repositories::staff_schedule_repository,
};

use crate::models::staff_schedule::Model as StaffScheduleModel;

pub async fn insert_staff_schedule(
    state: &State<'_, AppState>,
    staff_id: &str,
    start_time: &str,
    end_time: &str,
    task: &str,
) -> Result<(), String> {
    let schedule =
        staff_schedule_factory::create_staff_schedule(staff_id, start_time, end_time, task);
    staff_schedule_repository::insert_staff_schedule(state, schedule).await
}

pub async fn get_staff_schedule_from_staff_id(
    state: &State<'_, AppState>,
    staff_id: &str,
) -> Result<Vec<StaffScheduleModel>, String> {
    staff_schedule_repository::get_staff_schedule_from_staff_id(state, staff_id).await
}
