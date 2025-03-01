use serde::{Deserialize, Serialize};

use crate::models::ride::Model as RideModel;
use crate::models::staff::Model as StaffModel;

#[derive(Serialize, Deserialize)]
pub struct RideWithStaff {
    pub ride: RideModel,
    pub staff: StaffModel,
}
