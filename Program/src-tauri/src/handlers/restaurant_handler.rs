use chrono::NaiveTime;
use tauri::State;

use crate::factories::restaurant_factory;
use crate::repositories::staff_repository;
use crate::viewmodels::restaurant_with_staff_schedule::RestaurantWithStaffSchedule;
use crate::viewmodels::staff_with_schedule::StaffWithSchedule;
use crate::{modules::app_state::AppState, repositories::restaurant_repository};

use crate::models::restaurant::ActiveModel as RestaurantActiveModel;
use crate::models::restaurant::Model as RestaurantModel;

use super::{file_handler, restaurant_staff_handler, staff_schedule_handler};

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

pub async fn get_restaurant_by_id(
    state: &State<'_, AppState>,
    id: &str,
) -> Result<RestaurantModel, String> {
    restaurant_repository::get_restaurant_by_id(state, id).await
}

pub async fn update_restaurant(
    state: &State<'_, AppState>,
    restaurant_id: String,
    name: String,
    opening_time: String,
    closing_time: String,
    cuisine_type: String,
    image_name: Option<String>,
    image_bytes: Option<Vec<u8>>,
) -> Result<(), String> {
    let existing = match restaurant_repository::get_restaurant_by_id(state, &restaurant_id).await {
        Ok(r) => r,
        Err(err) => {
            return Err(format!(
                "Restaurant with ID {} not found: {}",
                restaurant_id, err
            ))
        }
    };

    let url = if let (Some(name), Some(bytes)) = (image_name, image_bytes) {
        match file_handler::upload_image_to_firebase(&name, &bytes).await {
            Ok(url) => url,
            Err(e) => return Err(format!("Failed to upload image: {}", e)),
        }
    } else {
        existing.image.clone()
    };

    let restaurant_active_model: RestaurantActiveModel = existing.into();

    let opening = NaiveTime::parse_from_str(&opening_time, "%H:%M:%S")
        .map_err(|_| "Invalid opening time format!".to_string())?;

    let closing = NaiveTime::parse_from_str(&closing_time, "%H:%M:%S")
        .map_err(|_| "Invalid closing time format!".to_string())?;

    restaurant_repository::update_restaurant(
        state,
        restaurant_active_model,
        name,
        opening,
        closing,
        cuisine_type,
        url,
    )
    .await
}

pub async fn delete_restaurant(state: &State<'_, AppState>, id: &str) -> Result<(), String> {
    restaurant_repository::delete_restaurant(state, id).await

    // TODO: Free all related staff schedules
}

pub async fn get_restaurants_with_staff_schedules(
    state: &State<'_, AppState>,
) -> Result<Vec<RestaurantWithStaffSchedule>, String> {
    let restaurants = get_all_restaurants(state).await?;

    let mut result = Vec::new();

    for restaurant in restaurants {
        let restaurant_id = &restaurant.id;

        let restaurant_staff =
            restaurant_staff_handler::get_staff_by_restaurant(state, restaurant_id).await?;

        let mut staff_schedules = Vec::new();

        for staff_entry in restaurant_staff {
            let staff_id = &staff_entry.staff_id;

            let staff_option = match staff_repository::get_staff_from_id(state, staff_id).await {
                Ok(staff) => staff,
                Err(err) => {
                    eprintln!("Failed to get staff details for ID {}: {:?}", staff_id, err);
                    continue;
                }
            };

            let staff = match staff_option {
                Some(staff) => staff,
                None => {
                    eprintln!("No staff found with ID {}", staff_id);
                    continue;
                }
            };

            let schedules =
                match staff_schedule_handler::get_staff_schedule_from_staff_id(state, staff_id)
                    .await
                {
                    Ok(schedules) => schedules,
                    Err(err) => {
                        eprintln!(
                            "Failed to get schedules for staff ID {}: {:?}",
                            staff_id, err
                        );
                        Vec::new()
                    }
                };

            staff_schedules.push(StaffWithSchedule { staff, schedules });
        }

        result.push(RestaurantWithStaffSchedule {
            restaurant,
            schedules: staff_schedules,
        });
    }

    Ok(result)
}
