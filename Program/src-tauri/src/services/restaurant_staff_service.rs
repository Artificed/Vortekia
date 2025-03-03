use tauri::State;

use crate::handlers::restaurant_staff_handler;
use crate::models::restaurant_staff::Model as RestaurantStaffModel;
use crate::modules::app_state::AppState;

#[tauri::command]
pub async fn insert_new_restaurant_staff(
    state: State<'_, AppState>,
    staff_id: &str,
    restaurant_id: &str,
) -> Result<(), String> {
    restaurant_staff_handler::insert_new_restaurant_staff(&state, staff_id, restaurant_id).await
}

#[tauri::command]
pub async fn remove_restaurant_staff(
    state: State<'_, AppState>,
    staff_id: &str,
    restaurant_id: &str,
) -> Result<(), String> {
    restaurant_staff_handler::remove_restaurant_staff(&state, staff_id, restaurant_id).await
}

#[tauri::command]
pub async fn update_restaurant_staff_assignment(
    state: State<'_, AppState>,
    old_restaurant_id: &str,
    new_restaurant_id: &str,
    old_staff_id: Option<&str>,
    new_staff_id: &str,
) -> Result<(), String> {
    restaurant_staff_handler::update_restaurant_staff_assignment(
        &state,
        old_restaurant_id,
        new_restaurant_id,
        old_staff_id,
        new_staff_id,
    )
    .await
}

#[tauri::command]
pub async fn get_all_restaurant_staff(
    state: State<'_, AppState>,
) -> Result<Vec<RestaurantStaffModel>, String> {
    restaurant_staff_handler::get_all_restaurant_staff(&state).await
}

#[tauri::command]
pub async fn get_restaurant_staff(
    state: State<'_, AppState>,
    id: &str,
) -> Result<RestaurantStaffModel, String> {
    restaurant_staff_handler::get_restaurant_staff(&state, id).await
}

#[tauri::command]
pub async fn get_staff_by_restaurant(
    state: State<'_, AppState>,
    restaurant_id: &str,
) -> Result<Vec<RestaurantStaffModel>, String> {
    restaurant_staff_handler::get_staff_by_restaurant(&state, restaurant_id).await
}
