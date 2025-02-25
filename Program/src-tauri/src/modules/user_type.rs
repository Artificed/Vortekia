use serde::Serialize;

use crate::models::customer::Model as CustomerModel;
use crate::models::staff::Model as StaffModel;

#[derive(Serialize, Clone)]
pub enum UserType {
    Customer(CustomerModel),
    Staff(StaffModel),
}
