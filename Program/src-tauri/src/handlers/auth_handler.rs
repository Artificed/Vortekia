use tauri::State;

use crate::modules::{app_state::AppState, user_type::UserType};

pub async fn logout_user(state: &State<'_, AppState>) -> Result<(), String> {
    let mut current_user = state.current_user.lock().await;
    *current_user = None;
    Ok(())
}

pub async fn get_current_user(state: &State<'_, AppState>) -> Result<Option<UserType>, String> {
    let current_user = state.current_user.lock().await;
    Ok(current_user.clone())
}
