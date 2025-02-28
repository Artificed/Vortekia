use sea_orm::ActiveValue;

use crate::models::ride::ActiveModel as RideActiveModel;

use super::id_factory;

pub fn create_ride(image: &str, name: &str, price: i32, status: &str) -> RideActiveModel {
    let id = id_factory::generate_customer_id();

    RideActiveModel {
        id: ActiveValue::Set(id),
        image: ActiveValue::Set(image.to_string()),
        name: ActiveValue::Set(name.to_string()),
        price: ActiveValue::Set(price),
        status: ActiveValue::Set(status.to_string()),
        assigned_staff: ActiveValue::NotSet,
    }
}
