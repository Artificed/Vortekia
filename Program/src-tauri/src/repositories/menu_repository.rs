use sea_orm::{ColumnTrait, EntityTrait, QueryFilter};
use tauri::State;

use super::customer_repository::AppState;
use crate::models::menu::{
    ActiveModel as MenuActiveModel, Column as MenuColumn, Entity as Menus, Model as MenuModel,
};

pub async fn insert_menu(state: &State<'_, AppState>, menu: MenuActiveModel) -> Result<(), String> {
    let result = Menus::insert(menu).exec(&state.conn).await;

    if result.is_ok() {
        Ok(())
    } else {
        Err("Failed to insert menu item".to_string())
    }
}

pub async fn get_menus(state: &State<'_, AppState>) -> Result<Vec<MenuModel>, String> {
    let result = Menus::find().all(&state.conn).await;

    match result {
        Ok(menus) => Ok(menus),
        Err(err) => {
            eprintln!("Error getting menu items: {:?}", err);
            Err("Failed to get menu items".to_string())
        }
    }
}

pub async fn find_menu_by_id(
    state: &State<'_, AppState>,
    id: &str,
) -> Result<Option<MenuModel>, String> {
    Menus::find()
        .filter(MenuColumn::Id.contains(id))
        .one(&state.conn)
        .await
        .map_err(|err| format!("Failed to find menu by ID: {}", err))
}

pub async fn get_menus_by_restaurant_id(
    state: &State<'_, AppState>,
    restaurant_id: &str,
) -> Result<Vec<MenuModel>, String> {
    Menus::find()
        .filter(MenuColumn::RestaurantId.eq(restaurant_id))
        .all(&state.conn)
        .await
        .map_err(|err| format!("Failed to find menus by restaurant ID: {}", err))
}
