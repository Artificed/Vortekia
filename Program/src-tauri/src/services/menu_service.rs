use tauri::State;

use crate::models::menu::Model as MenuModel;
use crate::{handlers::menu_handler, modules::app_state::AppState};

#[tauri::command]
pub async fn insert_new_menu(
    state: State<'_, AppState>,
    name: String,
    restaurant_id: String,
    image_name: String,
    price: i32,
    image_bytes: Vec<u8>,
) -> Result<(), String> {
    menu_handler::insert_new_menu(&state, name, restaurant_id, image_name, price, image_bytes).await
}

#[tauri::command]
pub async fn get_all_menus(state: State<'_, AppState>) -> Result<Vec<MenuModel>, String> {
    menu_handler::get_all_menus(&state).await
}

#[tauri::command]
pub async fn get_menus_by_restaurant_id(
    state: State<'_, AppState>,
    restaurant_id: &str,
) -> Result<Vec<MenuModel>, String> {
    menu_handler::get_menus_by_restaurant_id(&state, restaurant_id).await
}
