use crate::models::restaurant_transaction::ActiveModel as RestaurantTransactionActiveModel;
use chrono::NaiveDateTime;
use sea_orm::ActiveValue;

use super::id_factory;

pub fn create_restaurant_transaction(
    menu_id: String,
    restaurant_id: String,
    customer_id: String,
    quantity: i32,
    price: i32,
    transaction_date: NaiveDateTime,
    status: &str,
) -> RestaurantTransactionActiveModel {
    let id = id_factory::generate_customer_id();

    RestaurantTransactionActiveModel {
        id: ActiveValue::Set(id),
        menu_id: ActiveValue::Set(menu_id),
        restaurant_id: ActiveValue::Set(restaurant_id),
        customer_id: ActiveValue::Set(customer_id),
        quantity: ActiveValue::Set(quantity),
        price: ActiveValue::Set(price),
        transaction_date: ActiveValue::Set(transaction_date),
        status: ActiveValue::Set(status.to_string()),
    }
}
