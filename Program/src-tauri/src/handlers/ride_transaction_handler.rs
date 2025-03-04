use chrono::{NaiveDateTime, Utc};
use tauri::State;

use crate::factories::ride_transaction_factory;
use crate::{modules::app_state::AppState, repositories::ride_transaction_repository};

use crate::models::ride_transaction::Model as RideTransactionModel;

use super::customer_handler;

pub async fn insert_ride_transaction(
    state: &State<'_, AppState>,
    ride_id: String,
    customer_id: String,
    ride_price: i32,
) -> Result<(), String> {
    let transaction_date: NaiveDateTime = Utc::now().naive_utc();
    let res = customer_handler::add_current_user_balance(state, ride_price).await;

    let status = match res {
        Ok(()) => String::from("Completed"),
        Err(_) => String::from("Failed"),
    };

    let transaction = ride_transaction_factory::create_ride_transaction(
        ride_id,
        customer_id,
        ride_price.abs(),
        transaction_date,
        &status,
    );

    _ = ride_transaction_repository::insert_ride_transaction(state, transaction).await;

    if res.is_err() {
        Err("Insufficient balance to make transaction!".to_string())
    } else {
        Ok(())
    }
}

pub async fn get_all_ride_transactions(
    state: &State<'_, AppState>,
) -> Result<Vec<RideTransactionModel>, String> {
    ride_transaction_repository::get_all_ride_transactions(state).await
}

pub async fn get_current_user_ride_transactions(
    state: &State<'_, AppState>,
) -> Result<Vec<RideTransactionModel>, String> {
    ride_transaction_repository::get_current_user_ride_transactions(state).await
}

pub async fn get_ride_transaction(
    state: &State<'_, AppState>,
    id: String,
) -> Result<RideTransactionModel, String> {
    ride_transaction_repository::get_ride_transaction(state, &id).await
}

pub async fn delete_ride_transaction(
    state: &State<'_, AppState>,
    id: String,
) -> Result<(), String> {
    ride_transaction_repository::delete_ride_transaction(state, &id).await
}
