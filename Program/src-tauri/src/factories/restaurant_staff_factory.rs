use crate::models::restaurant_staff::ActiveModel as RestaurantStaffActiveModel;
use sea_orm::ActiveValue;

use super::id_factory;

pub fn create_restaurant_staff(staff_id: &str, restaurant_id: &str) -> RestaurantStaffActiveModel {
    let id = id_factory::generate_customer_id();

    RestaurantStaffActiveModel {
        id: ActiveValue::Set(id),
        staff_id: ActiveValue::Set(staff_id.to_string()),
        restaurant_id: ActiveValue::Set(restaurant_id.to_string()),
    }
}
