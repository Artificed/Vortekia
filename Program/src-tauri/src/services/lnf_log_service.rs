use tauri::State;

use crate::models::lost_and_found_log::Model as LnfModel;
use crate::{handlers::lnf_log_handler, modules::app_state::AppState};

#[tauri::command]
pub async fn insert_lnf_log(
    state: State<'_, AppState>,
    image: &str,
    name: &str,
    r#type: &str,
    color: &str,
    last_seen_location: &str,
    finder: &str,
    owner: &str,
    status: &str,
    image_bytes: Vec<u8>,
) -> Result<(), String> {
    lnf_log_handler::insert_lnf_log(
        state,
        image,
        name,
        r#type,
        color,
        last_seen_location,
        finder,
        owner,
        status,
        image_bytes,
    )
    .await
}

#[tauri::command]
pub async fn get_lnf_logs(state: State<'_, AppState>) -> Result<Vec<LnfModel>, String> {
    lnf_log_handler::get_lnf_logs(state).await
}
