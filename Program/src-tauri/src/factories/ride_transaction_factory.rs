use crate::models::ride_transaction::ActiveModel as RideTransactionActiveModel;
use chrono::NaiveDateTime;
use sea_orm::ActiveValue;

use super::id_factory;

pub fn create_ride_transaction(
    customer_id: String,
    ride_id: String,
    ride_price: i32,
    transaction_date: NaiveDateTime,
    status: &str,
) -> RideTransactionActiveModel {
    let id = id_factory::generate_customer_id();

    RideTransactionActiveModel {
        id: ActiveValue::Set(id),
        customer_id: ActiveValue::Set(customer_id),
        ride_id: ActiveValue::Set(ride_id),
        ride_price: ActiveValue::Set(ride_price),
        transaction_date: ActiveValue::Set(transaction_date),
        status: ActiveValue::Set(status.to_string()),
    }
}
