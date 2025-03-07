use tauri::State;

use crate::models::lost_and_found_log::Model as LnfLogModel;
use crate::{
    factories::lnf_log_factory, modules::app_state::AppState, repositories::lnf_log_repository,
};

use super::file_handler;

pub async fn insert_lnf_log(
    state: State<'_, AppState>,
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
    if status.is_empty() {
        return Err("Status must be specified!".to_string());
    }

    if name.is_empty() {
        return Err("Item name must be specified!".to_string());
    }

    if r#type.is_empty() {
        return Err("Item type must be specified!".to_string());
    }

    if color.is_empty() {
        return Err("Item color must be specified!".to_string());
    }

    if last_seen_location.is_empty() {
        return Err("Last seen location must be specified!".to_string());
    }

    if owner.is_empty() {
        return Err("Owner must be specified!".to_string());
    }

    if status == "Found" {
        if finder.is_none() {
            return Err(
                "Finder must be specified for Found or Returned To Owner status.".to_string(),
            );
        }
        if found_location.as_ref().map_or(true, |loc| loc.is_empty()) {
            return Err(
                "Found location must be specified for Found or Returned To Owner status."
                    .to_string(),
            );
        }
    }

    let image_url: Option<String>;
    match (image.as_ref(), image_bytes.as_ref()) {
        (Some(img_name), Some(bytes)) => {
            match file_handler::upload_image_to_firebase(img_name, bytes).await {
                Ok(url) => image_url = Some(url),
                Err(err) => {
                    eprintln!("Error saving image: {}", err);
                    return Err(format!("Failed to save image: {}", err));
                }
            }
        }
        (None, None) => {
            if status == "Found" || status == "Returned To Owner" {
                return Err("An image is required for a Found log.".to_string());
            }
            image_url = None;
        }
        _ => {
            return Err(
                "Both image name and image bytes must be provided when uploading an image."
                    .to_string(),
            );
        }
    }

    let log = lnf_log_factory::create_lnf_log(
        image_url,
        name,
        r#type,
        color,
        last_seen_location,
        found_location,
        finder,
        owner,
        status,
    );

    lnf_log_repository::insert_lnf_log(state, log).await
}

pub async fn get_lnf_logs(state: State<'_, AppState>) -> Result<Vec<LnfLogModel>, String> {
    lnf_log_repository::get_lnf_logs(state).await
}

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
    let existing_log = match lnf_log_repository::find_lnf_log_by_id(&state, id).await {
        Ok(Some(log)) => log,
        Ok(None) => return Err("Lost and Found log not found.".to_string()),
        Err(err) => {
            eprintln!("Error fetching LNF log: {}", err);
            return Err("Failed to retrieve lost and found log.".to_string());
        }
    };

    if status == "Found" || status == "Returned To Owner" {
        if finder.is_none() {
            return Err(
                "Finder must be specified for Found or Returned To Owner status.".to_string(),
            );
        }
        if found_location.as_ref().map_or(true, |loc| loc.is_empty()) {
            return Err(
                "Found location must be specified for Found or Returned To Owner status."
                    .to_string(),
            );
        }
    }

    let image_url: Option<String>;
    match (image.as_ref(), image_bytes.as_ref()) {
        (Some(img_name), Some(bytes)) => {
            match file_handler::upload_image_to_firebase(img_name, bytes).await {
                Ok(url) => image_url = Some(url),
                Err(err) => {
                    eprintln!("Error saving image: {}", err);
                    return Err(format!("Failed to save image: {}", err));
                }
            }
        }
        (None, None) => {
            image_url = existing_log.image.clone();
        }
        _ => {
            return Err(
                "Both image name and image bytes must be provided when updating the image."
                    .to_string(),
            );
        }
    }

    if (status == "Found" || status == "Returned To Owner") && image_url.is_none() {
        return Err("An image is required for a Found log.".to_string());
    }

    lnf_log_repository::update_lnf_log(
        state,
        id,
        image_url,
        name,
        r#type,
        color,
        last_seen_location,
        found_location,
        finder,
        owner,
        status,
    )
    .await
}
