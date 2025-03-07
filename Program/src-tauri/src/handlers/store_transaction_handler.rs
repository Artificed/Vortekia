use chrono::{NaiveDateTime, Utc};
use tauri::State;

use crate::factories::store_transaction_factory;
use crate::{modules::app_state::AppState, repositories::store_transaction_repository};

use crate::models::store_transaction::Model as StoreTransactionModel;

use super::customer_handler;

pub async fn insert_store_transaction(
    state: &State<'_, AppState>,
    souvenir_id: String,
    customer_id: String,
    quantity: i32,
    price: i32,
) -> Result<(), String> {
    let transaction_date: NaiveDateTime = Utc::now().naive_utc();

    if souvenir_id.is_empty() {
        return Err("Souvenir ID is empty!".to_string());
    }
    if customer_id.is_empty() {
        return Err("Customer ID is empty!".to_string());
    }
    if quantity <= 0 {
        return Err("Quantity must be more than 0!".to_string());
    }
    if price <= 0 {
        return Err("Price must be more than 0!".to_string());
    }

    let res = customer_handler::add_current_user_balance(state, price * quantity).await;

    let status = match res {
        Ok(()) => String::from("Completed"),
        Err(_) => String::from("Failed"),
    };

    if status == "Completed" {
        let transaction = store_transaction_factory::create_store_transaction(
            souvenir_id,
            customer_id,
            quantity,
            price.abs(),
            transaction_date,
            status,
        );

        _ = store_transaction_repository::insert_store_transaction(state, transaction).await;
    }

    if res.is_err() {
        Err("Insufficient balance to make transaction!".to_string())
    } else {
        Ok(())
    }
}

pub async fn get_all_store_transactions(
    state: &State<'_, AppState>,
) -> Result<Vec<StoreTransactionModel>, String> {
    store_transaction_repository::get_all_store_transactions(state).await
}

pub async fn get_current_user_store_transactions(
    state: &State<'_, AppState>,
) -> Result<Vec<StoreTransactionModel>, String> {
    store_transaction_repository::get_current_user_store_transactions(state).await
}

pub async fn get_store_transaction(
    state: &State<'_, AppState>,
    id: String,
) -> Result<StoreTransactionModel, String> {
    store_transaction_repository::get_store_transaction(state, &id).await
}

pub async fn delete_store_transaction(
    state: &State<'_, AppState>,
    id: String,
) -> Result<(), String> {
    store_transaction_repository::delete_store_transaction(state, &id).await
}
