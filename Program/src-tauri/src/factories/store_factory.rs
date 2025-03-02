use chrono::NaiveTime;
use sea_orm::ActiveValue;

use crate::models::store::ActiveModel as StoreActiveModel;

use super::id_factory;

pub fn create_store(
    image: String,
    name: String,
    description: String,
    opening_time: String,
    closing_time: String,
) -> StoreActiveModel {
    let menu_id = id_factory::generate_customer_id();

    let opening =
        NaiveTime::parse_from_str(&opening_time, "%H:%M:%S").expect("Invalid start_time format");
    let closing =
        NaiveTime::parse_from_str(&closing_time, "%H:%M:%S").expect("Invalid end_time format");

    StoreActiveModel {
        id: ActiveValue::Set(menu_id),
        image: ActiveValue::Set(image),
        name: ActiveValue::Set(name),
        description: ActiveValue::Set(description),
        opening_time: ActiveValue::Set(opening),
        closing_time: ActiveValue::Set(closing),
        sales_associate: ActiveValue::NotSet,
    }
}
