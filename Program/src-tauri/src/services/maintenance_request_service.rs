use tauri::State;

use crate::{handlers::maintenance_request_handler, modules::app_state::AppState};

#[tauri::command]
pub async fn insert_new_maintenance_request(
    state: State<'_, AppState>,
    title: String,
    content: String,
) -> Result<(), String> {
    maintenance_request_handler::insert_new_maintenance_request(&state, title, content).await
}
