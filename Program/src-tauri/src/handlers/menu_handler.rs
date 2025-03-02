use tauri::State;

use crate::factories::menu_factory;
use crate::{modules::app_state::AppState, repositories::menu_repository};

use crate::models::menu::Model as MenuModel;

use super::file_handler;

pub async fn insert_new_menu(
    state: &State<'_, AppState>,
    name: String,
    restaurant_id: String,
    image_name: String,
    price: i32,
    image_bytes: Vec<u8>,
) -> Result<(), String> {
    if name.is_empty() {
        return Err("Name must not be empty!".to_string());
    }

    if price <= 0 {
        return Err("Price must be more than 0!".to_string());
    }

    if image_name.is_empty() {
        return Err("Image name must be set!".to_string());
    }

    if image_bytes.is_empty() {
        return Err("Image data must be set!".to_string());
    }

    let res = file_handler::upload_image_to_firebase(&image_name, &image_bytes).await;

    match res {
        Ok(url) => {
            let menu = menu_factory::create_menu(restaurant_id, url, name, price);
            menu_repository::insert_menu(state, menu).await
        }
        Err(_) => Err("Failed to upload image to firebase!".to_string()),
    }
}

pub async fn get_all_menus(state: &State<'_, AppState>) -> Result<Vec<MenuModel>, String> {
    menu_repository::get_menus(state).await
}

pub async fn get_menus_by_restaurant_id(
    state: &State<'_, AppState>,
    restaurant_id: &str,
) -> Result<Vec<MenuModel>, String> {
    menu_repository::get_menus_by_restaurant_id(state, restaurant_id).await
}
