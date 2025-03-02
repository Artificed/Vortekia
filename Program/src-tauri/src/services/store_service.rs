use tauri::State;

use crate::handlers::store_handler;
use crate::models::store::Model as StoreModel;
use crate::modules::app_state::AppState;

#[tauri::command]
pub async fn insert_new_store(
    state: State<'_, AppState>,
    store_name: String,
    opening_time: String,
    closing_time: String,
    description: String,
    image: String,
) -> Result<(), String> {
    store_handler::insert_new_store(
        &state,
        store_name,
        opening_time,
        closing_time,
        description,
        image,
    )
    .await
}

#[tauri::command]
pub async fn get_all_stores(state: State<'_, AppState>) -> Result<Vec<StoreModel>, String> {
    store_handler::get_all_stores(&state).await
}

#[tauri::command]
pub async fn update_store(
    state: State<'_, AppState>,
    store_id: String,
    name: String,
    opening_time: String,
    closing_time: String,
    description: String,
    image_name: Option<String>,
    image_bytes: Option<Vec<u8>>,
    sales_associate: Option<String>,
) -> Result<(), String> {
    store_handler::update_store(
        &state,
        store_id,
        name,
        opening_time,
        closing_time,
        description,
        image_name,
        image_bytes,
        sales_associate,
    )
    .await
}

#[tauri::command]
pub async fn delete_store(state: State<'_, AppState>, store_id: String) -> Result<(), String> {
    store_handler::delete_store(&state, store_id).await
}
