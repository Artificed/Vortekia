use sea_orm::ActiveValue;
use tauri::State;

use crate::models::ride::Model as RideModel;
use crate::repositories::staff_schedule_repository;
use crate::{factories::ride_factory, modules::app_state::AppState, repositories::ride_repository};

use super::staff_schedule_handler;

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

pub async fn update_staff_schedule_for_ride(
    state: &State<'_, AppState>,
    old_ride_name: &str,
    new_ride_name: &str,
    old_staff_id: Option<&str>,
    new_staff_id: &str,
    opening_time: &str,
    closing_time: &str,
) -> Result<(), String> {
    if let Some(old_id) = old_staff_id {
        if old_id != new_staff_id {
            let old_staff_schedules =
                staff_schedule_handler::get_staff_schedule_from_staff_id(state, old_id).await?;
            let task_name = format!("Assigned To Ride {}", old_ride_name);

            for schedule in old_staff_schedules {
                if schedule.task == task_name {
                    staff_schedule_repository::delete_staff_schedule(state, &schedule.id)
                        .await
                        .map_err(|e| format!("Failed to delete old staff schedule: {}", e))?;
                    break;
                }
            }
        } else {
            let staff_schedules =
                staff_schedule_handler::get_staff_schedule_from_staff_id(state, new_staff_id)
                    .await?;
            let old_task_name = format!("Assigned To Ride {}", old_ride_name);

            for schedule in staff_schedules {
                if schedule.task == old_task_name {
                    staff_schedule_repository::delete_staff_schedule(state, &schedule.id)
                        .await
                        .map_err(|e| format!("Failed to delete old staff schedule: {}", e))?;
                    break;
                }
            }
        }
    }
    staff_schedule_handler::insert_staff_schedule(
        state,
        new_staff_id,
        opening_time,
        closing_time,
        format!("Assigned To Ride {}", new_ride_name).as_str(),
    )
    .await
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
    let existing_ride: RideModel = ride_repository::get_ride_by_id(state, id)
        .await?
        .ok_or_else(|| "Ride not found!".to_string())?;

    let existing_task: String = format!("Assigned To Ride {}", existing_ride.name);

    staff_schedule_handler::validate_staff_schedule(
        state,
        assigned_staff,
        opening_time,
        closing_time,
        Some(existing_task.as_str()),
    )
    .await?;

    let mut updated_ride =
        ride_factory::create_ride(image, name, price, opening_time, closing_time, status);
    updated_ride.assigned_staff = ActiveValue::Set(Some(assigned_staff.to_string()));

    update_staff_schedule_for_ride(
        state,
        &existing_ride.name,
        name,
        existing_ride.assigned_staff.as_deref(),
        assigned_staff,
        opening_time,
        closing_time,
    )
    .await?;

    ride_repository::update_ride(state, id, updated_ride).await
}
