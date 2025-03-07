use tauri::State;

use crate::factories::souvenir_factory;
use crate::{modules::app_state::AppState, repositories::souvenir_repository};

use crate::models::souvenir::Model as SouvenirModel;

use super::file_handler;

pub async fn insert_new_souvenir(
    state: &State<'_, AppState>,
    store_id: String,
    name: String,
    image_name: String,
    price: i32,
    description: String,
    image_bytes: Vec<u8>,
) -> Result<(), String> {
    if store_id.is_empty() {
        return Err("Store ID must not be empty!".to_string());
    }

    if name.is_empty() {
        return Err("Name must not be empty!".to_string());
    }

    if price <= 0 {
        return Err("Price must be more than 0!".to_string());
    }

    if description.is_empty() {
        return Err("Description must not be empty!".to_string());
    }

    if image_name.is_empty() || image_bytes.is_empty() {
        return Err("Image must be set!".to_string());
    }

    let res = file_handler::upload_image_to_firebase(&image_name, &image_bytes).await;

    match res {
        Ok(url) => {
            let souvenir =
                souvenir_factory::create_souvenir(store_id, name, price, description, url);
            souvenir_repository::insert_souvenir(state, souvenir).await
        }
        Err(_) => Err("Failed to upload image to firebase!".to_string()),
    }
}

pub async fn get_all_souvenirs(state: &State<'_, AppState>) -> Result<Vec<SouvenirModel>, String> {
    souvenir_repository::get_souvenirs(state).await
}

pub async fn find_souvenir_by_id(
    state: &State<'_, AppState>,
    id: &str,
) -> Result<Option<SouvenirModel>, String> {
    souvenir_repository::find_souvenir_by_id(state, id).await
}

pub async fn get_souvenirs_by_store_id(
    state: &State<'_, AppState>,
    store_id: &str,
) -> Result<Vec<SouvenirModel>, String> {
    souvenir_repository::get_souvenirs_by_store_id(state, store_id).await
}

pub async fn delete_souvenir(state: &State<'_, AppState>, souvenir_id: &str) -> Result<(), String> {
    souvenir_repository::delete_souvenir(state, souvenir_id).await
}
