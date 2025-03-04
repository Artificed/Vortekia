use serde::{Deserialize, Serialize};

use super::staff_with_schedule::StaffWithSchedule;
use crate::models::restaurant::Model as RestaurantModel;

#[derive(Serialize, Deserialize)]
pub struct RestaurantWithStaffSchedule {
    pub restaurant: RestaurantModel,
    pub schedules: Vec<StaffWithSchedule>,
}
