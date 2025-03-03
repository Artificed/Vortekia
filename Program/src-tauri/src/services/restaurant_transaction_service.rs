use tauri::State;

use crate::handlers::restaurant_transaction_handler;
use crate::modules::app_state::AppState;

use crate::models::restaurant_transaction::Model as RestaurantTransactionModel;

#[tauri::command]
pub async fn insert_restaurant_transaction(
    state: State<'_, AppState>,
    menu_id: String,
    customer_id: String,
    quantity: i32,
    price: i32,
) -> Result<(), String> {
    restaurant_transaction_handler::insert_restaurant_transaction(
        &state,
        menu_id,
        customer_id,
        quantity,
        price,
    )
    .await
}

#[tauri::command]
pub async fn get_all_restaurant_transactions(
    state: State<'_, AppState>,
) -> Result<Vec<RestaurantTransactionModel>, String> {
    restaurant_transaction_handler::get_all_restaurant_transactions(&state).await
}

#[tauri::command]
pub async fn get_restaurant_transaction(
    state: State<'_, AppState>,
    id: String,
) -> Result<RestaurantTransactionModel, String> {
    restaurant_transaction_handler::get_restaurant_transaction(&state, id).await
}

#[tauri::command]
pub async fn delete_restaurant_transaction(
    state: State<'_, AppState>,
    id: String,
) -> Result<(), String> {
    restaurant_transaction_handler::delete_restaurant_transaction(&state, id).await
}
