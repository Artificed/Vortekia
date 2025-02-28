use sea_orm::ActiveValue;

use crate::models::ride::ActiveModel as RideActiveModel;

use super::id_factory;

pub fn create_ride(image: &str, name: &str, price: i32) -> RideActiveModel {
    let id = id_factory::generate_customer_id();

    RideActiveModel {
        id: ActiveValue::Set(id),
        image: ActiveValue::Set(image.to_string()),
        name: ActiveValue::Set(name.to_string()),
        price: ActiveValue::Set(price),
    }
}
