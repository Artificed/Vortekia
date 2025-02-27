use tauri::State;

use crate::{
    factories::lnf_log_factory, modules::app_state::AppState, repositories::lnf_log_repository,
};

use super::file_handler;

pub async fn insert_lnf_log(
    state: State<'_, AppState>,
    image_name: &str,
    name: &str,
    r#type: &str,
    color: &str,
    last_seen_location: &str,
    finder: &str,
    owner: &str,
    status: &str,
    image_bytes: Vec<u8>,
) -> Result<(), String> {
    let image_path = file_handler::save_image_to_disk(image_name, &image_bytes);

    match image_path {
        Ok(path) => {
            let log = lnf_log_factory::create_lnf_log(
                &path,
                name,
                r#type,
                color,
                last_seen_location,
                finder,
                owner,
                status,
            );

            lnf_log_repository::insert_lnf_log(state, log).await
        }
        Err(err) => {
            eprintln!("Error saving image: {}", err);
            Err(format!("Failed to save image: {}", err))
        }
    }
}
