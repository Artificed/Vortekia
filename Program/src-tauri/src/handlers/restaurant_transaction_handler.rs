use chrono::{NaiveDateTime, Utc};
use tauri::State;

use crate::factories::restaurant_transaction_factory;
use crate::{modules::app_state::AppState, repositories::restaurant_transaction_repository};

use crate::models::restaurant_transaction::Model as RestaurantTransactionModel;

use super::customer_handler;

pub async fn insert_restaurant_transaction(
    state: &State<'_, AppState>,
    menu_id: String,
    restaurant_id: String,
    customer_id: String,
    quantity: i32,
    price: i32,
) -> Result<(), String> {
    let transaction_date: NaiveDateTime = Utc::now().naive_utc();
    let res = customer_handler::add_current_user_balance(state, price * quantity).await;

    let status = match res {
        Ok(()) => String::from("Pending"),
        Err(_) => String::from("Failed"),
    };

    let transaction = restaurant_transaction_factory::create_restaurant_transaction(
        menu_id,
        restaurant_id,
        customer_id,
        quantity,
        price.abs(),
        transaction_date,
        &status,
    );

    _ = restaurant_transaction_repository::insert_restaurant_transaction(state, transaction).await;

    if res.is_err() {
        Err("Insufficient balance to make transaction!".to_string())
    } else {
        Ok(())
    }
}

pub async fn get_all_restaurant_transactions(
    state: &State<'_, AppState>,
) -> Result<Vec<RestaurantTransactionModel>, String> {
    restaurant_transaction_repository::get_all_restaurant_transactions(state).await
}

pub async fn get_restaurant_transactions_by_restaurant(
    state: &State<'_, AppState>,
    restaurant_id: &str,
) -> Result<Vec<RestaurantTransactionModel>, String> {
    restaurant_transaction_repository::get_restaurant_transactions_by_restaurant(
        state,
        restaurant_id,
    )
    .await
}

pub async fn get_current_user_restaurant_transactions(
    state: &State<'_, AppState>,
) -> Result<Vec<RestaurantTransactionModel>, String> {
    restaurant_transaction_repository::get_current_user_restaurant_transactions(state).await
}

pub async fn get_restaurant_transactions_by_status(
    state: &State<'_, AppState>,
    id: &str,
    status: &str,
) -> Result<Vec<RestaurantTransactionModel>, String> {
    restaurant_transaction_repository::get_restaurant_transactions_by_status(state, id, status)
        .await
}

pub async fn get_restaurant_transaction(
    state: &State<'_, AppState>,
    id: String,
) -> Result<RestaurantTransactionModel, String> {
    restaurant_transaction_repository::get_restaurant_transaction(state, &id).await
}

pub async fn delete_restaurant_transaction(
    state: &State<'_, AppState>,
    id: String,
) -> Result<(), String> {
    restaurant_transaction_repository::delete_restaurant_transaction(state, &id).await
}

pub async fn update_restaurant_transaction_status(
    state: &State<'_, AppState>,
    id: &str,
    new_status: &str,
) -> Result<(), String> {
    restaurant_transaction_repository::update_restaurant_transaction_status(state, id, new_status)
        .await
}
