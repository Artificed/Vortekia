use chrono::NaiveTime;
use tauri::State;

use crate::repositories::staff_repository;
use crate::viewmodels::staff_with_schedule::StaffWithSchedule;
use crate::{
    factories::staff_schedule_factory, modules::app_state::AppState,
    repositories::staff_schedule_repository,
};

use crate::models::ride_staff::Model as RideStaffModel;
use crate::models::staff_schedule::Model as StaffScheduleModel;

use super::staff_handler;

pub async fn insert_staff_schedule(
    state: &State<'_, AppState>,
    staff_id: &str,
    start_time: &str,
    end_time: &str,
    task: &str,
) -> Result<(), String> {
    let schedule =
        staff_schedule_factory::create_staff_schedule(staff_id, start_time, end_time, task);
    staff_schedule_repository::insert_staff_schedule(state, schedule).await
}

pub async fn get_staff_schedule_from_staff_id(
    state: &State<'_, AppState>,
    staff_id: &str,
) -> Result<Vec<StaffScheduleModel>, String> {
    staff_schedule_repository::get_staff_schedule_from_staff_id(state, staff_id).await
}

pub async fn validate_staff_schedule(
    state: &State<'_, AppState>,
    staff_id: &str,
    opening_time: &str,
    closing_time: &str,
    exclude_task: Option<&str>,
) -> Result<(), String> {
    let staff = staff_repository::get_staff_from_id(state, staff_id)
        .await?
        .ok_or_else(|| "Staff Not Found!".to_string())?;

    let opening = NaiveTime::parse_from_str(opening_time, "%H:%M:%S")
        .map_err(|_| "Invalid opening time format!".to_string())?;
    let closing = NaiveTime::parse_from_str(closing_time, "%H:%M:%S")
        .map_err(|_| "Invalid closing time format!".to_string())?;

    let shift_start = staff.shift_start;
    let shift_end = staff.shift_end;
    if opening < shift_start || closing > shift_end {
        return Err("Schedule is outside the staff's shift!".to_string());
    }

    let staff_schedules = get_staff_schedule_from_staff_id(state, staff_id).await?;

    for schedule in staff_schedules {
        if let Some(task) = exclude_task {
            if schedule.task == task {
                continue;
            }
        }

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

    Ok(())
}

pub async fn get_all_ride_staff_schedules(
    state: &State<'_, AppState>,
) -> Result<Vec<StaffWithSchedule>, String> {
    let staff_list = staff_handler::get_ride_staffs(state).await?;

    let mut staff_with_schedules = Vec::new();

    for staff in staff_list {
        let schedules: Vec<StaffScheduleModel> =
            get_staff_schedule_from_staff_id(state, &staff.id).await?;

        staff_with_schedules.push(StaffWithSchedule { staff, schedules });
    }

    Ok(staff_with_schedules)
}
