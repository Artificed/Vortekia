use tauri::State;

use crate::handlers::ride_transaction_handler;
use crate::modules::app_state::AppState;

use crate::models::ride_transaction::Model as RideTransactionModel;

#[tauri::command]
pub async fn insert_ride_transaction(
    state: State<'_, AppState>,
    ride_id: String,
    customer_id: String,
    ride_price: i32,
) -> Result<(), String> {
    ride_transaction_handler::insert_ride_transaction(&state, ride_id, customer_id, ride_price)
        .await
}

#[tauri::command]
pub async fn get_all_ride_transactions(
    state: State<'_, AppState>,
) -> Result<Vec<RideTransactionModel>, String> {
    ride_transaction_handler::get_all_ride_transactions(&state).await
}

#[tauri::command]
pub async fn get_ride_transaction(
    state: State<'_, AppState>,
    id: String,
) -> Result<RideTransactionModel, String> {
    ride_transaction_handler::get_ride_transaction(&state, id).await
}

#[tauri::command]
pub async fn get_current_user_ride_transactions(
    state: State<'_, AppState>,
) -> Result<Vec<RideTransactionModel>, String> {
    ride_transaction_handler::get_current_user_ride_transactions(&state).await
}

#[tauri::command]
pub async fn delete_ride_transaction(state: State<'_, AppState>, id: String) -> Result<(), String> {
    ride_transaction_handler::delete_ride_transaction(&state, id).await
}
