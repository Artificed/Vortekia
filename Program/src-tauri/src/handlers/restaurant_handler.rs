use tauri::State;

use crate::factories::restaurant_factory;
use crate::{modules::app_state::AppState, repositories::restaurant_repository};

use crate::models::restaurant::Model as RestaurantModel;

pub async fn insert_new_restaurant(
    state: &State<'_, AppState>,
    restaurant_name: String,
    opening_time: String,
    closing_time: String,
    cuisine_type: String,
    image: String,
) -> Result<(), String> {
    let restaurant = restaurant_factory::create_restaurant(
        &restaurant_name,
        &image,
        &opening_time,
        &closing_time,
        &cuisine_type,
    );
    restaurant_repository::insert_restaurant(state, restaurant).await
}

pub async fn get_all_restaurants(
    state: &State<'_, AppState>,
) -> Result<Vec<RestaurantModel>, String> {
    restaurant_repository::get_all_restaurants(state).await
}
