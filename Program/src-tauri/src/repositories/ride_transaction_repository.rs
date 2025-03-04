use tauri::State;

use crate::models::ride_transaction::ActiveModel as RideTransactionActiveModel;
use crate::models::ride_transaction::Column as RideTransactionColumn;
use crate::models::ride_transaction::Entity as RideTransactions;
use crate::models::ride_transaction::Model as RideTransactionModel;
use crate::modules::app_state::AppState;
use crate::modules::user_type::UserType;
use sea_orm::{ColumnTrait, EntityTrait, QueryFilter};

pub async fn insert_ride_transaction(
    state: &State<'_, AppState>,
    new_transaction: RideTransactionActiveModel,
) -> Result<(), String> {
    let result = RideTransactions::insert(new_transaction)
        .exec(&state.conn)
        .await;

    match result {
        Ok(_) => Ok(()),
        Err(err) => {
            eprintln!("Failed to insert ride transaction: {:?}", err);
            Err(format!("Failed to insert ride transaction: {:?}", err))
        }
    }
}

pub async fn get_all_ride_transactions(
    state: &State<'_, AppState>,
) -> Result<Vec<RideTransactionModel>, String> {
    let result = RideTransactions::find().all(&state.conn).await;

    match result {
        Ok(transactions) => Ok(transactions),
        Err(err) => {
            eprintln!("Failed to get all ride transactions: {:?}", err);
            Err(format!("Failed to get all ride transactions: {:?}", err))
        }
    }
}

pub async fn get_ride_transaction(
    state: &State<'_, AppState>,
    id: &str,
) -> Result<RideTransactionModel, String> {
    let result = RideTransactions::find()
        .filter(RideTransactionColumn::Id.eq(id.to_owned()))
        .one(&state.conn)
        .await;

    match result {
        Ok(Some(transaction)) => Ok(transaction),
        Ok(None) => Err(format!("Ride transaction with ID {} not found", id)),
        Err(err) => {
            eprintln!("Failed to get ride transaction: {:?}", err);
            Err(format!("Failed to get ride transaction: {:?}", err))
        }
    }
}

pub async fn get_current_user_ride_transactions(
    state: &State<'_, AppState>,
) -> Result<Vec<RideTransactionModel>, String> {
    let current_user = state.current_user.lock().await;

    match &*current_user {
        Some(UserType::Customer(customer)) => {
            let customer_id = customer.id.clone();

            let result = RideTransactions::find()
                .filter(RideTransactionColumn::CustomerId.eq(customer_id))
                .all(&state.conn)
                .await;

            match result {
                Ok(transactions) => Ok(transactions),
                Err(err) => {
                    eprintln!("Failed to get ride transactions for user: {:?}", err);
                    Err(format!(
                        "Failed to get ride transactions for user: {:?}",
                        err
                    ))
                }
            }
        }
        Some(UserType::Staff(_)) => {
            Err(String::from("Staff members do not have ride transactions!"))
        }
        None => Err(String::from("User is not logged in!")),
    }
}

pub async fn delete_ride_transaction(state: &State<'_, AppState>, id: &str) -> Result<(), String> {
    let result = RideTransactions::delete_many()
        .filter(RideTransactionColumn::Id.eq(id.to_owned()))
        .exec(&state.conn)
        .await;

    match result {
        Ok(_) => Ok(()),
        Err(err) => {
            eprintln!("Failed to delete ride transaction: {:?}", err);
            Err(format!("Failed to delete ride transaction: {:?}", err))
        }
    }
}
