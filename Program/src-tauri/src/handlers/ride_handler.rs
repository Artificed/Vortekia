use sea_orm::ActiveValue;
use tauri::State;

use crate::models::ride::Model as RideModel;
use crate::{factories::ride_factory, modules::app_state::AppState, repositories::ride_repository};

pub async fn insert_ride(
    state: &State<'_, AppState>,
    image: &str,
    name: &str,
    price: i32,
) -> Result<(), String> {
    let ride = ride_factory::create_ride(image, name, price, "Closed");
    ride_repository::insert_ride(state, ride).await
}

pub async fn get_all_rides(state: &State<'_, AppState>) -> Result<Vec<RideModel>, String> {
    ride_repository::get_all_rides(state).await
}

pub async fn update_ride(
    state: &State<'_, AppState>,
    id: &str,
    image: &str,
    name: &str,
    price: i32,
    status: &str,
    assigned_staff: &str,
) -> Result<(), String> {
    let mut updated_ride = ride_factory::create_ride(image, name, price, status);
    updated_ride.assigned_staff = ActiveValue::Set(Some(assigned_staff.to_string()));

    ride_repository::update_ride(state, id, updated_ride).await
}
