use chrono::NaiveTime;
use sea_orm::ActiveValue;

use crate::models::ride::ActiveModel as RideActiveModel;

use super::id_factory;

pub fn create_ride(
    image: &str,
    name: &str,
    price: i32,
    opening_time: &str,
    closing_time: &str,
    status: &str,
) -> RideActiveModel {
    let id = id_factory::generate_customer_id();

    let opening =
        NaiveTime::parse_from_str(opening_time, "%H:%M:%S").expect("Invalid opening time format!");
    let closing =
        NaiveTime::parse_from_str(closing_time, "%H:%M:%S").expect("Invalid closing time format!");

    RideActiveModel {
        id: ActiveValue::Set(id),
        image: ActiveValue::Set(image.to_string()),
        name: ActiveValue::Set(name.to_string()),
        price: ActiveValue::Set(price),
        opening_time: ActiveValue::Set(opening),
        closing_time: ActiveValue::Set(closing),
        status: ActiveValue::Set(status.to_string()),
        assigned_staff: ActiveValue::NotSet,
        is_active: ActiveValue::Set(1),
    }
}
