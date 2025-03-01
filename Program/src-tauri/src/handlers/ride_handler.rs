use chrono::NaiveTime;
use sea_orm::ActiveValue;
use tauri::State;

use crate::models::ride::Model as RideModel;
use crate::repositories::{staff_repository, staff_schedule_repository};
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
    let existing_ride = ride_repository::get_ride_by_id(state, id)
        .await?
        .ok_or_else(|| "Ride not found!".to_string())?;

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

    let staff_schedules =
        staff_schedule_handler::get_staff_schedule_from_staff_id(state, assigned_staff).await?;

    let existing_schedule = staff_schedules.iter().find(|schedule| {
        schedule.task == format!("Assigned To Ride {}", existing_ride.name.clone())
    });

    for schedule in staff_schedules
        .iter()
        .filter(|s| Some(s) != existing_schedule.as_ref())
    {
        let schedule_start = schedule.start_time;
        let schedule_end = schedule.end_time;

        if (opening >= schedule_start && opening < schedule_end)
            || (closing > schedule_start && closing <= schedule_end)
            || (opening <= schedule_start && closing >= schedule_end)
        {
            return Err(format!(
                "Schedule conflict! Staff is already assigned to '{}' from {} to {}",
                schedule.task,
                schedule_start.format("%H:%M:%S"),
                schedule_end.format("%H:%M:%S")
            ));
        }
    }

    let mut updated_ride =
        ride_factory::create_ride(image, name, price, opening_time, closing_time, status);
    updated_ride.assigned_staff = ActiveValue::Set(Some(assigned_staff.to_string()));

    if let Some(prev_schedule) = existing_schedule {
        if existing_ride.assigned_staff.unwrap_or_default() == assigned_staff
            && (prev_schedule.start_time.to_string() != opening_time
                || prev_schedule.end_time.to_string() != closing_time)
        {
            staff_schedule_repository::delete_staff_schedule(state, &prev_schedule.id)
                .await
                .map_err(|e| format!("Failed to delete old staff schedule: {}", e))?;

            staff_schedule_handler::insert_staff_schedule(
                state,
                assigned_staff,
                opening_time,
                closing_time,
                format!("Assigned To Ride {}", name).as_str(),
            )
            .await
            .map_err(|e| format!("Failed to insert staff schedule: {}", e))?;
        }
    } else if existing_ride.assigned_staff.is_some()
        && existing_ride.assigned_staff.as_ref().unwrap() != assigned_staff
    {
        let old_staff_id = existing_ride.assigned_staff.unwrap();
        let old_staff_schedules =
            staff_schedule_handler::get_staff_schedule_from_staff_id(state, &old_staff_id).await?;

        for old_schedule in old_staff_schedules {
            if old_schedule.task == format!("Assigned To Ride {}", existing_ride.name.clone()) {
                staff_schedule_repository::delete_staff_schedule(state, &old_schedule.id)
                    .await
                    .map_err(|e| format!("Failed to delete old staff schedule: {}", e))?;
                break;
            }
        }
        staff_schedule_handler::insert_staff_schedule(
            state,
            assigned_staff,
            opening_time,
            closing_time,
            format!("Assigned To Ride {}", name).as_str(),
        )
        .await
        .map_err(|e| format!("Failed to insert staff schedule: {}", e))?;
    } else {
        staff_schedule_handler::insert_staff_schedule(
            state,
            assigned_staff,
            opening_time,
            closing_time,
            format!("Assigned To Ride {}", name).as_str(),
        )
        .await
        .map_err(|e| format!("Failed to insert staff schedule: {}", e))?;
    }

    ride_repository::update_ride(state, id, updated_ride).await
}
