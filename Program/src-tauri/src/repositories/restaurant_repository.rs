use chrono::DateTime;
use chrono::Local;
use chrono::NaiveTime;
use chrono::Timelike;
use sea_orm::ActiveModelTrait;
use sea_orm::ActiveValue;
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
    let result = Restaurants::find()
        .filter(RestaurantColumn::IsActive.eq(1))
        .all(&state.conn)
        .await;

    match result {
        Ok(restaurant_list) => {
            let local_time: DateTime<Local> = Local::now();
            let current_time = NaiveTime::from_hms_opt(
                local_time.hour(),
                local_time.minute(),
                local_time.second(),
            )
            .unwrap();

            let modified_list = restaurant_list
                .into_iter()
                .map(|mut restaurant| {
                    let is_within_hours = if restaurant.opening_time <= restaurant.closing_time {
                        current_time >= restaurant.opening_time
                            && current_time <= restaurant.closing_time
                    } else {
                        current_time >= restaurant.opening_time
                            || current_time <= restaurant.closing_time
                    };

                    if !is_within_hours {
                        restaurant.is_open = 0;
                    }

                    restaurant
                })
                .collect();

            Ok(modified_list)
        }
        Err(err) => {
            eprintln!("Failed to get all restaurant list: {:?}", err);
            Err(format!("Failed to get all restaurant list: {:?}", err))
        }
    }
}

pub async fn get_restaurant_by_id(
    state: &State<'_, AppState>,
    id: &str,
) -> Result<RestaurantModel, String> {
    let result = Restaurants::find()
        .filter(RestaurantColumn::Id.eq(id.to_owned()))
        .filter(RestaurantColumn::IsActive.eq(1))
        .one(&state.conn)
        .await;

    match result {
        Ok(Some(mut restaurant)) => {
            let local_time: DateTime<Local> = Local::now();
            let current_time = NaiveTime::from_hms_opt(
                local_time.hour(),
                local_time.minute(),
                local_time.second(),
            )
            .unwrap();

            let is_within_hours = if restaurant.opening_time <= restaurant.closing_time {
                current_time >= restaurant.opening_time && current_time <= restaurant.closing_time
            } else {
                current_time >= restaurant.opening_time || current_time <= restaurant.closing_time
            };

            if !is_within_hours {
                restaurant.is_open = 0;
            }

            Ok(restaurant)
        }
        Ok(None) => Err(format!("Restaurant with ID {} not found", id)),
        Err(err) => {
            eprintln!("Failed to get restaurant: {:?}", err);
            Err(format!("Failed to get restaurant: {:?}", err))
        }
    }
}

pub async fn update_restaurant(
    state: &State<'_, AppState>,
    mut restaurant: RestaurantActiveModel,
    name: String,
    opening_time: NaiveTime,
    closing_time: NaiveTime,
    cuisine_type: String,
    url: String,
    is_open: i8,
) -> Result<(), String> {
    restaurant.name = ActiveValue::Set(name);
    restaurant.opening_time = ActiveValue::Set(opening_time);
    restaurant.closing_time = ActiveValue::Set(closing_time);
    restaurant.cuisine_type = ActiveValue::Set(cuisine_type);
    restaurant.image = ActiveValue::Set(url);
    restaurant.is_open = ActiveValue::Set(is_open);

    let result = restaurant.update(&state.conn).await;
    match result {
        Ok(_) => Ok(()),
        Err(err) => {
            eprintln!("Failed to update restaurant: {:?}", err);
            Err(format!("Failed to update restaurant: {:?}", err))
        }
    }
}

pub async fn delete_restaurant(state: &State<'_, AppState>, id: &str) -> Result<(), String> {
    let result = Restaurants::find()
        .filter(RestaurantColumn::Id.eq(id.to_owned()))
        .filter(RestaurantColumn::IsActive.eq(1))
        .one(&state.conn)
        .await;

    match result {
        Ok(Some(restaurant_model)) => {
            let mut restaurant_active: crate::models::restaurant::ActiveModel =
                restaurant_model.into();
            restaurant_active.is_active = ActiveValue::Set(0);

            let update_result = restaurant_active.update(&state.conn).await;
            match update_result {
                Ok(_) => Ok(()),
                Err(err) => {
                    eprintln!("Failed to delete restaurant: {:?}", err);
                    Err(format!("Failed to delete restaurant: {:?}", err))
                }
            }
        }
        Ok(None) => Err(format!(
            "Restaurant with ID {} not found or already inactive",
            id
        )),
        Err(err) => {
            eprintln!("Error retrieving restaurant: {:?}", err);
            Err(format!("Error retrieving restaurant: {:?}", err))
        }
    }
}
