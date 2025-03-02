use tauri::State;

use crate::{
    handlers::staff_schedule_handler, modules::app_state::AppState,
    viewmodels::staff_with_schedule::StaffWithSchedule,
};

#[tauri::command]
pub async fn get_all_ride_staff_schedules(
    state: State<'_, AppState>,
) -> Result<Vec<StaffWithSchedule>, String> {
    staff_schedule_handler::get_all_ride_staff_schedules(&state).await
}

#[tauri::command]
pub async fn get_all_sales_associate_schedules(
    state: State<'_, AppState>,
) -> Result<Vec<StaffWithSchedule>, String> {
    staff_schedule_handler::get_all_sales_associate_schedules(&state).await
}
