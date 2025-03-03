use tauri::State;

use crate::{
    factories::restaurant_staff_factory,
    modules::app_state::AppState,
    repositories::{restaurant_staff_repository, staff_repository, staff_schedule_repository},
};

use crate::models::restaurant_staff::Model as RestaurantStaffModel;

use super::{restaurant_handler, staff_schedule_handler};

pub async fn validate_restaurant_staff_assignment(
    state: &State<'_, AppState>,
    staff_id: &str,
    restaurant_id: &str,
) -> Result<(), String> {
    let restaurant = restaurant_handler::get_restaurant_by_id(state, restaurant_id).await?;

    let staff = staff_repository::get_staff_from_id(state, staff_id)
        .await?
        .ok_or_else(|| "Staff Not Found!".to_string())?;

    let restaurant_opening = restaurant.opening_time;
    let restaurant_closing = restaurant.closing_time;
    let shift_start = staff.shift_start;
    let shift_end = staff.shift_end;

    if restaurant_opening < shift_start || restaurant_closing > shift_end {
        return Err("Restaurant hours are outside the staff's shift!".to_string());
    }

    let staff_schedules =
        staff_schedule_handler::get_staff_schedule_from_staff_id(state, staff_id).await?;

    for schedule in staff_schedules {
        let schedule_start = schedule.start_time;
        let schedule_end = schedule.end_time;

        if (restaurant_opening >= schedule_start && restaurant_opening < schedule_end)
            || (restaurant_closing > schedule_start && restaurant_closing <= schedule_end)
            || (restaurant_opening <= schedule_start && restaurant_closing >= schedule_end)
        {
            return Err(format!(
                "Schedule conflict! Staff is already assigned to '{}' from {} to {}",
                schedule.task,
                schedule_start.format("%H:%M:%S"),
                schedule_end.format("%H:%M:%S")
            ));
        }
    }

    Ok(())
}

pub async fn insert_new_restaurant_staff(
    state: &State<'_, AppState>,
    staff_id: &str,
    restaurant_id: &str,
) -> Result<(), String> {
    let restaurant = restaurant_handler::get_restaurant_by_id(state, restaurant_id).await?;

    validate_restaurant_staff_assignment(state, staff_id, restaurant_id).await?;

    let opening_time = restaurant.opening_time.format("%H:%M:%S").to_string();
    let closing_time = restaurant.closing_time.format("%H:%M:%S").to_string();

    let task_name = format!("Assigned To Restaurant {}", restaurant.name);

    let restaurant_staff =
        restaurant_staff_factory::create_restaurant_staff(staff_id, restaurant_id);
    restaurant_staff_repository::insert_restaurant_staff(state, restaurant_staff).await?;

    staff_schedule_handler::insert_staff_schedule(
        state,
        staff_id,
        &opening_time,
        &closing_time,
        &task_name,
    )
    .await
}

pub async fn remove_restaurant_staff(
    state: &State<'_, AppState>,
    staff_id: &str,
    restaurant_id: &str,
) -> Result<(), String> {
    let restaurant = restaurant_handler::get_restaurant_by_id(state, restaurant_id).await?;

    let staff_schedules =
        staff_schedule_handler::get_staff_schedule_from_staff_id(state, staff_id).await?;

    let task_name = format!("Assigned To Restaurant {}", restaurant.name);

    for schedule in staff_schedules {
        if schedule.task == task_name {
            staff_schedule_repository::delete_staff_schedule(state, &schedule.id)
                .await
                .map_err(|e| format!("Failed to delete staff schedule: {}", e))?;
            break;
        }
    }

    restaurant_staff_repository::delete_restaurant_staff(state, staff_id, restaurant_id)
        .await
        .map_err(|e| format!("Failed to delete restaurant staff relationship: {}", e))
}

pub async fn update_restaurant_staff_assignment(
    state: &State<'_, AppState>,
    old_restaurant_id: &str,
    new_restaurant_id: &str,
    old_staff_id: Option<&str>,
    new_staff_id: &str,
) -> Result<(), String> {
    let old_restaurant = restaurant_handler::get_restaurant_by_id(state, old_restaurant_id).await?;
    let new_restaurant = restaurant_handler::get_restaurant_by_id(state, new_restaurant_id).await?;

    let opening_time = new_restaurant.opening_time.format("%H:%M:%S").to_string();
    let closing_time = new_restaurant.closing_time.format("%H:%M:%S").to_string();

    if let Some(old_id) = old_staff_id {
        if old_id != new_staff_id {
            let old_staff_schedules =
                staff_schedule_handler::get_staff_schedule_from_staff_id(state, old_id).await?;
            let old_task_name = format!("Assigned To Restaurant {}", old_restaurant.name);

            for schedule in old_staff_schedules {
                if schedule.task == old_task_name {
                    staff_schedule_repository::delete_staff_schedule(state, &schedule.id)
                        .await
                        .map_err(|e| format!("Failed to delete old staff schedule: {}", e))?;
                    break;
                }
            }

            restaurant_staff_repository::delete_restaurant_staff(state, old_id, old_restaurant_id)
                .await
                .map_err(|e| {
                    format!("Failed to delete old restaurant staff relationship: {}", e)
                })?;

            validate_restaurant_staff_assignment(state, new_staff_id, new_restaurant_id).await?;

            let restaurant_staff =
                restaurant_staff_factory::create_restaurant_staff(new_staff_id, new_restaurant_id);
            restaurant_staff_repository::insert_restaurant_staff(state, restaurant_staff).await?;
        } else {
            if old_restaurant_id != new_restaurant_id {
                restaurant_staff_repository::delete_restaurant_staff(
                    state,
                    new_staff_id,
                    old_restaurant_id,
                )
                .await
                .map_err(|e| {
                    format!("Failed to delete old restaurant staff relationship: {}", e)
                })?;

                validate_restaurant_staff_assignment(state, new_staff_id, new_restaurant_id)
                    .await?;

                let restaurant_staff = restaurant_staff_factory::create_restaurant_staff(
                    new_staff_id,
                    new_restaurant_id,
                );
                restaurant_staff_repository::insert_restaurant_staff(state, restaurant_staff)
                    .await?;
            }

            let staff_schedules =
                staff_schedule_handler::get_staff_schedule_from_staff_id(state, new_staff_id)
                    .await?;
            let old_task_name = format!("Assigned To Restaurant {}", old_restaurant.name);

            for schedule in staff_schedules {
                if schedule.task == old_task_name {
                    staff_schedule_repository::delete_staff_schedule(state, &schedule.id)
                        .await
                        .map_err(|e| format!("Failed to delete old staff schedule: {}", e))?;
                    break;
                }
            }
        }
    } else {
        validate_restaurant_staff_assignment(state, new_staff_id, new_restaurant_id).await?;

        let restaurant_staff =
            restaurant_staff_factory::create_restaurant_staff(new_staff_id, new_restaurant_id);
        restaurant_staff_repository::insert_restaurant_staff(state, restaurant_staff).await?;
    }

    let new_task_name = format!("Assigned To Restaurant {}", new_restaurant.name);
    staff_schedule_handler::insert_staff_schedule(
        state,
        new_staff_id,
        &opening_time,
        &closing_time,
        &new_task_name,
    )
    .await
}

pub async fn get_all_restaurant_staff(
    state: &State<'_, AppState>,
) -> Result<Vec<RestaurantStaffModel>, String> {
    restaurant_staff_repository::get_all_restaurant_staff(state).await
}

pub async fn get_restaurant_staff(
    state: &State<'_, AppState>,
    id: &str,
) -> Result<RestaurantStaffModel, String> {
    restaurant_staff_repository::get_restaurant_staff(state, id).await
}

pub async fn get_staff_by_restaurant(
    state: &State<'_, AppState>,
    restaurant_id: &str,
) -> Result<Vec<RestaurantStaffModel>, String> {
    restaurant_staff_repository::get_staff_by_restaurant(state, restaurant_id).await
}
