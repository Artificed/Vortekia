use crate::models::customer::ActiveModel as CustomerActiveModel;

use sea_orm::ActiveValue;

use super::id_factory;

pub fn create_customer(username: &str) -> CustomerActiveModel {
    let customer_id = id_factory::generate_customer_id();

    CustomerActiveModel {
        id: ActiveValue::Set(customer_id),
        username: ActiveValue::Set(username.to_string()),
        balance: ActiveValue::Set(0),
    }
}
