use chrono::{NaiveDateTime, Utc};
use tauri::State;

use crate::factories::restaurant_transaction_factory;
use crate::{modules::app_state::AppState, repositories::restaurant_transaction_repository};

use crate::models::restaurant_transaction::Model as RestaurantTransactionModel;

use super::customer_handler;

pub async fn insert_restaurant_transaction(
    state: &State<'_, AppState>,
    menu_id: String,
    customer_id: String,
    quantity: i32,
    price: i32,
) -> Result<(), String> {
    let transaction_date: NaiveDateTime = Utc::now().naive_utc();

    customer_handler::add_current_user_balance(state, price * quantity).await?;

    let transaction = restaurant_transaction_factory::create_restaurant_transaction(
        menu_id,
        customer_id,
        quantity,
        price.abs(),
        transaction_date,
    );

    restaurant_transaction_repository::insert_restaurant_transaction(state, transaction).await
}

pub async fn get_all_restaurant_transactions(
    state: &State<'_, AppState>,
) -> Result<Vec<RestaurantTransactionModel>, String> {
    restaurant_transaction_repository::get_all_restaurant_transactions(state).await
}

pub async fn get_current_user_restaurant_transactions(
    state: &State<'_, AppState>,
) -> Result<Vec<RestaurantTransactionModel>, String> {
    restaurant_transaction_repository::get_current_user_restaurant_transactions(state).await
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
