use tauri::State;

use crate::{
    handlers::auth_handler,
    modules::{app_state::AppState, user_type::UserType},
};

#[tauri::command]
pub async fn logout_user(state: State<'_, AppState>) -> Result<(), String> {
    auth_handler::logout_user(state).await
}

#[tauri::command]
pub async fn get_current_user(state: State<'_, AppState>) -> Result<Option<UserType>, String> {
    auth_handler::get_current_user(state).await
}
