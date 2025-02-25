use tauri::State;

use crate::modules::{app_state::AppState, ui_type::UiType};

#[tauri::command]
pub async fn get_current_ui(state: State<'_, AppState>) -> Result<UiType, String> {
    let current_ui = state.config.ui_type.clone();
    Result::Ok(current_ui)
}
