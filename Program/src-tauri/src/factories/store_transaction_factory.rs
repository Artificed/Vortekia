use crate::models::store_transaction::ActiveModel as StoreTransactionActiveModel;
use chrono::NaiveDateTime;
use sea_orm::ActiveValue;

use super::id_factory;

pub fn create_store_transaction(
    souvenir_id: String,
    customer_id: String,
    quantity: i32,
    price: i32,
    transaction_date: NaiveDateTime,
    status: String,
) -> StoreTransactionActiveModel {
    let id = id_factory::generate_customer_id();

    StoreTransactionActiveModel {
        id: ActiveValue::Set(id),
        souvenir_id: ActiveValue::Set(souvenir_id),
        customer_id: ActiveValue::Set(customer_id),
        quantity: ActiveValue::Set(quantity),
        price: ActiveValue::Set(price),
        transaction_date: ActiveValue::Set(transaction_date),
        status: ActiveValue::Set(status),
    }
}
