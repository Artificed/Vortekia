use tauri::State;

use crate::models::lost_and_found_log::Model as LnfModel;
use crate::{handlers::lnf_log_handler, modules::app_state::AppState};

#[tauri::command]
pub async fn insert_lnf_log(
    state: State<'_, AppState>,
    name: &str,
    r#type: &str,
    color: &str,
    last_seen_location: &str,
    owner: &str,
    status: &str,
) -> Result<(), String> {
    lnf_log_handler::insert_lnf_log(
        state,
        name,
        r#type,
        color,
        last_seen_location,
        owner,
        status,
    )
    .await
}

#[tauri::command]
pub async fn get_lnf_logs(state: State<'_, AppState>) -> Result<Vec<LnfModel>, String> {
    lnf_log_handler::get_lnf_logs(state).await
}

#[tauri::command]
pub async fn update_lnf_log(
    state: State<'_, AppState>,
    id: &str,
    image: Option<String>,
    name: &str,
    r#type: &str,
    color: &str,
    last_seen_location: &str,
    found_location: Option<String>,
    finder: Option<String>,
    owner: &str,
    status: &str,
    image_bytes: Option<Vec<u8>>,
) -> Result<(), String> {
    lnf_log_handler::update_lnf_log(
        state,
        id,
        image,
        name,
        r#type,
        color,
        last_seen_location,
        found_location,
        finder,
        owner,
        status,
        image_bytes,
    )
    .await
}
