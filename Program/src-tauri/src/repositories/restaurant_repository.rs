use tauri::State;

use crate::models::restaurant::ActiveModel as RestaurantActiveModel;
use crate::models::restaurant::Column as RestaurantColumn;
use crate::models::restaurant::Entity as Restaurants;
use crate::models::restaurant::Model as RestaurantModel;
use crate::modules::app_state::AppState;
use sea_orm::{ColumnTrait, EntityTrait, QueryFilter};

pub async fn insert_restaurant(
    state: &State<'_, AppState>,
    restaurant: RestaurantActiveModel,
) -> Result<(), String> {
    let result = Restaurants::insert(restaurant).exec(&state.conn).await;

    match result {
        Ok(_) => Ok(()),
        Err(err) => {
            eprintln!("Failed to insert new restaurant: {:?}", err);
            Err(format!("Failed to insert new restaurant: {:?}", err))
        }
    }
}

pub async fn get_all_restaurants(
    state: &State<'_, AppState>,
) -> Result<Vec<RestaurantModel>, String> {
    let result = Restaurants::find().all(&state.conn).await;

    match result {
        Ok(restaurant_list) => Ok(restaurant_list),
        Err(err) => {
            eprintln!("Failed to get all new restaurant list: {:?}", err);
            Err(format!("Failed to get all new restaurant list: {:?}", err))
        }
    }
}

pub async fn get_restaurant(
    state: &State<'_, AppState>,
    id: &str,
) -> Result<RestaurantModel, String> {
    let result = Restaurants::find()
        .filter(RestaurantColumn::Id.eq(id.to_owned()))
        .one(&state.conn)
        .await;

    match result {
        Ok(Some(restaurant)) => Ok(restaurant),
        Ok(None) => Err(format!("Restaurant with ID {} not found", id)),
        Err(err) => {
            eprintln!("Failed to get restaurant: {:?}", err);
            Err(format!("Failed to get restaurant: {:?}", err))
        }
    }
}
