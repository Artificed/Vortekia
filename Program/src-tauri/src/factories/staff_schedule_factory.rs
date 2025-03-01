use crate::models::staff_schedule::ActiveModel as StaffScheduleActiveModel;
use chrono::NaiveTime;
use sea_orm::ActiveValue;

use super::id_factory;

pub fn create_staff_schedule(
    staff_id: &str,
    start_time: &str,
    end_time: &str,
    task: &str,
) -> StaffScheduleActiveModel {
    let schedule_id = id_factory::generate_customer_id();

    let start_time_naive =
        NaiveTime::parse_from_str(start_time, "%H:%M:%S").expect("Invalid start_time format");
    let end_time_naive =
        NaiveTime::parse_from_str(end_time, "%H:%M:%S").expect("Invalid end_time format");

    StaffScheduleActiveModel {
        id: ActiveValue::Set(schedule_id),
        staff_id: ActiveValue::Set(staff_id.to_string()),
        start_time: ActiveValue::Set(start_time_naive),
        end_time: ActiveValue::Set(end_time_naive),
        task: ActiveValue::Set(task.to_string()),
    }
}
