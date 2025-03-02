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
