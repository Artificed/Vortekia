use tauri::State;

use crate::models::store_transaction::ActiveModel as StoreTransactionActiveModel;
use crate::models::store_transaction::Column as StoreTransactionColumn;
use crate::models::store_transaction::Entity as StoreTransactions;
use crate::models::store_transaction::Model as StoreTransactionModel;
use crate::modules::app_state::AppState;
use crate::modules::user_type::UserType;
use sea_orm::{ColumnTrait, EntityTrait, QueryFilter};

pub async fn insert_store_transaction(
    state: &State<'_, AppState>,
    new_transaction: StoreTransactionActiveModel,
) -> Result<(), String> {
    let result = StoreTransactions::insert(new_transaction)
        .exec(&state.conn)
        .await;

    match result {
        Ok(_) => Ok(()),
        Err(err) => {
            eprintln!("Failed to insert store transaction: {:?}", err);
            Err(format!("Failed to insert store transaction: {:?}", err))
        }
    }
}

pub async fn get_all_store_transactions(
    state: &State<'_, AppState>,
) -> Result<Vec<StoreTransactionModel>, String> {
    let result = StoreTransactions::find().all(&state.conn).await;

    match result {
        Ok(transactions) => Ok(transactions),
        Err(err) => {
            eprintln!("Failed to get all store transactions: {:?}", err);
            Err(format!("Failed to get all store transactions: {:?}", err))
        }
    }
}

pub async fn get_store_transaction(
    state: &State<'_, AppState>,
    id: &str,
) -> Result<StoreTransactionModel, String> {
    let result = StoreTransactions::find()
        .filter(StoreTransactionColumn::Id.eq(id.to_owned()))
        .one(&state.conn)
        .await;

    match result {
        Ok(Some(transaction)) => Ok(transaction),
        Ok(None) => Err(format!("Store transaction with ID {} not found", id)),
        Err(err) => {
            eprintln!("Failed to get store transaction: {:?}", err);
            Err(format!("Failed to get store transaction: {:?}", err))
        }
    }
}

pub async fn get_current_user_store_transactions(
    state: &State<'_, AppState>,
) -> Result<Vec<StoreTransactionModel>, String> {
    let current_user = state.current_user.lock().await;

    match &*current_user {
        Some(UserType::Customer(customer)) => {
            let customer_id = customer.id.clone();

            let result = StoreTransactions::find()
                .filter(StoreTransactionColumn::CustomerId.eq(customer_id))
                .all(&state.conn)
                .await;

            match result {
                Ok(transactions) => Ok(transactions),
                Err(err) => {
                    eprintln!("Failed to get store transactions for user: {:?}", err);
                    Err(format!(
                        "Failed to get store transactions for user: {:?}",
                        err
                    ))
                }
            }
        }
        Some(UserType::Staff(_)) => Err(String::from(
            "Staff members do not have store transactions!",
        )),
        None => Err(String::from("User is not logged in!")),
    }
}

pub async fn delete_store_transaction(state: &State<'_, AppState>, id: &str) -> Result<(), String> {
    let result = StoreTransactions::delete_many()
        .filter(StoreTransactionColumn::Id.eq(id.to_owned()))
        .exec(&state.conn)
        .await;

    match result {
        Ok(_) => Ok(()),
        Err(err) => {
            eprintln!("Failed to delete store transaction: {:?}", err);
            Err(format!("Failed to delete store transaction: {:?}", err))
        }
    }
}
