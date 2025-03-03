use crate::models::restaurant::ActiveModel as RestaurantActiveModel;
use chrono::NaiveTime;
use sea_orm::ActiveValue;

use super::id_factory;

pub fn create_restaurant(
    name: &str,
    image: &str,
    opening_time: &str,
    closing_time: &str,
    cuisine_type: &str,
) -> RestaurantActiveModel {
    let id = id_factory::generate_customer_id();

    let opening_time_naive =
        NaiveTime::parse_from_str(opening_time, "%H:%M:%S").expect("Invalid start_time format");
    let closing_time_naive =
        NaiveTime::parse_from_str(closing_time, "%H:%M:%S").expect("Invalid end_time format");

    RestaurantActiveModel {
        id: ActiveValue::Set(id),
        name: ActiveValue::Set(name.to_string()),
        image: ActiveValue::Set(image.to_string()),
        opening_time: ActiveValue::Set(opening_time_naive),
        closing_time: ActiveValue::Set(closing_time_naive),
        cuisine_type: ActiveValue::Set(cuisine_type.to_string()),
        is_open: ActiveValue::Set(0),
        is_active: ActiveValue::Set(0),
    }
}
