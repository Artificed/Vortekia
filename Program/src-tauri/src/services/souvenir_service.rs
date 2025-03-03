use tauri::State;

use crate::models::souvenir::Model as SouvenirModel;
use crate::{handlers::souvenir_handler, modules::app_state::AppState};

#[tauri::command]
pub async fn insert_new_souvenir(
    state: State<'_, AppState>,
    store_id: String,
    name: String,
    image_name: String,
    price: i32,
    description: String,
    image_bytes: Vec<u8>,
) -> Result<(), String> {
    souvenir_handler::insert_new_souvenir(
        &state,
        store_id,
        name,
        image_name,
        price,
        description,
        image_bytes,
    )
    .await
}

#[tauri::command]
pub async fn get_all_souvenirs(state: State<'_, AppState>) -> Result<Vec<SouvenirModel>, String> {
    souvenir_handler::get_all_souvenirs(&state).await
}

#[tauri::command]
pub async fn get_souvenirs_by_store_id(
    state: State<'_, AppState>,
    store_id: &str,
) -> Result<Vec<SouvenirModel>, String> {
    souvenir_handler::get_souvenirs_by_store_id(&state, store_id).await
}

#[tauri::command]
pub async fn delete_souvenir(state: State<'_, AppState>, souvenir_id: &str) -> Result<(), String> {
    souvenir_handler::delete_souvenir(&state, souvenir_id).await
}
