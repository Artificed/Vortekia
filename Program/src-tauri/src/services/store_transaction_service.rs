use tauri::State;

use crate::handlers::store_transaction_handler;
use crate::modules::app_state::AppState;

use crate::models::store_transaction::Model as StoreTransactionModel;

#[tauri::command]
pub async fn insert_store_transaction(
    state: State<'_, AppState>,
    souvenir_id: String,
    customer_id: String,
    quantity: i32,
    price: i32,
) -> Result<(), String> {
    store_transaction_handler::insert_store_transaction(
        &state,
        souvenir_id,
        customer_id,
        quantity,
        price,
    )
    .await
}

#[tauri::command]
pub async fn get_all_store_transactions(
    state: State<'_, AppState>,
) -> Result<Vec<StoreTransactionModel>, String> {
    store_transaction_handler::get_all_store_transactions(&state).await
}

#[tauri::command]
pub async fn get_store_transaction(
    state: State<'_, AppState>,
    id: String,
) -> Result<StoreTransactionModel, String> {
    store_transaction_handler::get_store_transaction(&state, id).await
}

#[tauri::command]
pub async fn get_current_user_store_transactions(
    state: State<'_, AppState>,
) -> Result<Vec<StoreTransactionModel>, String> {
    store_transaction_handler::get_current_user_store_transactions(&state).await
}

#[tauri::command]
pub async fn delete_store_transaction(
    state: State<'_, AppState>,
    id: String,
) -> Result<(), String> {
    store_transaction_handler::delete_store_transaction(&state, id).await
}
