use serde::{Deserialize, Serialize};

use crate::models::staff::Model as StaffModel;
use crate::models::staff_schedule::Model as StaffScheduleModel;

#[derive(Serialize, Deserialize)]
pub struct StaffWithSchedule {
    pub staff: StaffModel,
    pub schedules: Vec<StaffScheduleModel>,
}
