use tauri::State;

use crate::handlers::restaurant_handler;
use crate::models::restaurant::Model as RestaurantModel;
use crate::modules::app_state::AppState;

#[tauri::command]
pub async fn get_all_restaurants(
    state: State<'_, AppState>,
) -> Result<Vec<RestaurantModel>, String> {
    restaurant_handler::get_all_restaurants(&state).await
}

#[tauri::command]
pub async fn update_restaurant(
    state: State<'_, AppState>,
    restaurant_id: String,
    name: String,
    opening_time: String,
    closing_time: String,
    cuisine_type: String,
    image_name: Option<String>,
    image_bytes: Option<Vec<u8>>,
) -> Result<(), String> {
    restaurant_handler::update_restaurant(
        &state,
        restaurant_id,
        name,
        opening_time,
        closing_time,
        cuisine_type,
        image_name,
        image_bytes,
    )
    .await
}
