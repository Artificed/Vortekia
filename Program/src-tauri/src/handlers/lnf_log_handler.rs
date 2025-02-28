use tauri::State;

use crate::models::lost_and_found_log::Model as LnfLogModel;
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
    let image_url = file_handler::upload_image_to_firebase(image_name, &image_bytes).await;

    match image_url {
        Ok(url) => {
            let log = lnf_log_factory::create_lnf_log(
                &url,
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

pub async fn get_lnf_logs(state: State<'_, AppState>) -> Result<Vec<LnfLogModel>, String> {
    lnf_log_repository::get_lnf_logs(state).await
}

pub async fn update_lnf_log(
    state: State<'_, AppState>,
    id: &str,
    image: Option<&str>,
    name: &str,
    r#type: &str,
    color: &str,
    last_seen_location: &str,
    finder: &str,
    owner: &str,
    status: &str,
    image_bytes: Option<Vec<u8>>,
) -> Result<(), String> {
    if let (Some(image_name), Some(bytes)) = (image, image_bytes.as_ref()) {
        match file_handler::upload_image_to_firebase(image_name, bytes).await {
            Ok(url) => {
                lnf_log_repository::update_lnf_log(
                    state,
                    id,
                    Some(url),
                    name,
                    r#type,
                    color,
                    last_seen_location,
                    finder,
                    owner,
                    status,
                )
                .await
            }
            Err(err) => {
                eprintln!("Error saving image: {}", err);
                Err(format!("Failed to save image: {}", err))
            }
        }
    } else {
        lnf_log_repository::update_lnf_log(
            state,
            id,
            None,
            name,
            r#type,
            color,
            last_seen_location,
            finder,
            owner,
            status,
        )
        .await
    }
}
