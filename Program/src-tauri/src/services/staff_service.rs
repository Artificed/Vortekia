use tauri::State;

use crate::{handlers::staff_handler, modules::app_state::AppState};

#[tauri::command]
pub async fn login_staff(
    state: State<'_, AppState>,
    username: String,
    password: String,
) -> Result<(), String> {
    staff_handler::login_staff(state, &username, &password).await
}
