use crate::models::customer::Model as CustomerModel;
use crate::models::staff::Model as StaffModel;

pub enum UserType {
    Customer(CustomerModel),
    Staff(StaffModel),
}
