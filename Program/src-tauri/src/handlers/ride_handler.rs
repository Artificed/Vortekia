use chrono::NaiveTime;
use sea_orm::ActiveValue;
use tauri::State;

use crate::models::ride::Model as RideModel;
use crate::repositories::staff_repository;
use crate::{factories::ride_factory, modules::app_state::AppState, repositories::ride_repository};

pub async fn insert_ride(
    state: &State<'_, AppState>,
    image: &str,
    name: &str,
    price: i32,
    opening_time: &str,
    closing_time: &str,
) -> Result<(), String> {
    let ride = ride_factory::create_ride(image, name, price, opening_time, closing_time, "Closed");
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
    opening_time: &str,
    closing_time: &str,
    assigned_staff: &str,
) -> Result<(), String> {
    let staff = staff_repository::get_staff_from_id(state, assigned_staff)
        .await?
        .ok_or_else(|| "Staff Not Found!".to_string())?;

    let opening = NaiveTime::parse_from_str(opening_time, "%H:%M:%S")
        .map_err(|_| "Invalid opening time format!".to_string())?;
    let closing = NaiveTime::parse_from_str(closing_time, "%H:%M:%S")
        .map_err(|_| "Invalid closing time format!".to_string())?;

    let shift_start = staff.shift_start;
    let shift_end = staff.shift_end;

    if opening < shift_start || closing > shift_end {
        return Err("Ride schedule is outside the assigned staff's shift!".to_string());
    }

    let mut updated_ride =
        ride_factory::create_ride(image, name, price, opening_time, closing_time, status);
    updated_ride.assigned_staff = ActiveValue::Set(Some(assigned_staff.to_string()));

    ride_repository::update_ride(state, id, updated_ride).await
}
