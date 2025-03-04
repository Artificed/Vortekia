use serde::{Deserialize, Serialize};

use crate::models::restaurant::Model as RestaurantModel;
use crate::models::staff::Model as StaffModel;

#[derive(Serialize, Deserialize)]
pub struct RestaurantWithStaffs {
    pub restaurant: RestaurantModel,
    pub staffs: Vec<StaffModel>,
}
