use tauri::State;

use crate::models::staff::Model as StaffModel;
use crate::{handlers::staff_handler, modules::app_state::AppState};

#[tauri::command]
pub async fn login_staff(
    state: State<'_, AppState>,
    username: String,
    password: String,
) -> Result<(), String> {
    staff_handler::login_staff(state, &username, &password).await
}

#[tauri::command]
pub async fn register_staff(
    state: State<'_, AppState>,
    username: String,
    password: String,
    role: String,
) -> Result<(), String> {
    staff_handler::register_staff(state, &username, &password, &role).await
}

#[tauri::command]
pub async fn get_lnf_staffs(state: State<'_, AppState>) -> Result<Vec<StaffModel>, String> {
    staff_handler::get_lnf_staffs(state).await
}
