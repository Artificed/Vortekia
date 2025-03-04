use tauri::State;

use crate::models::restaurant_transaction::ActiveModel as RestaurantTransactionActiveModel;
use crate::models::restaurant_transaction::Column as RestaurantTransactionColumn;
use crate::models::restaurant_transaction::Entity as RestaurantTransactions;
use crate::models::restaurant_transaction::Model as RestaurantTransactionModel;
use crate::modules::app_state::AppState;
use crate::modules::user_type::UserType;
use sea_orm::{ColumnTrait, EntityTrait, QueryFilter};

pub async fn insert_restaurant_transaction(
    state: &State<'_, AppState>,
    new_transaction: RestaurantTransactionActiveModel,
) -> Result<(), String> {
    let result = RestaurantTransactions::insert(new_transaction)
        .exec(&state.conn)
        .await;

    match result {
        Ok(_) => Ok(()),
        Err(err) => {
            eprintln!("Failed to insert restaurant transaction: {:?}", err);
            Err(format!(
                "Failed to insert restaurant transaction: {:?}",
                err
            ))
        }
    }
}

pub async fn get_all_restaurant_transactions(
    state: &State<'_, AppState>,
) -> Result<Vec<RestaurantTransactionModel>, String> {
    let result = RestaurantTransactions::find().all(&state.conn).await;

    match result {
        Ok(transactions) => Ok(transactions),
        Err(err) => {
            eprintln!("Failed to get all restaurant transactions: {:?}", err);
            Err(format!(
                "Failed to get all restaurant transactions: {:?}",
                err
            ))
        }
    }
}

pub async fn get_restaurant_transaction(
    state: &State<'_, AppState>,
    id: &str,
) -> Result<RestaurantTransactionModel, String> {
    let result = RestaurantTransactions::find()
        .filter(RestaurantTransactionColumn::Id.eq(id.to_owned()))
        .one(&state.conn)
        .await;

    match result {
        Ok(Some(transaction)) => Ok(transaction),
        Ok(None) => Err(format!("Restaurant transaction with ID {} not found", id)),
        Err(err) => {
            eprintln!("Failed to get restaurant transaction: {:?}", err);
            Err(format!("Failed to get restaurant transaction: {:?}", err))
        }
    }
}

pub async fn get_restaurant_transactions_by_status(
    state: &State<'_, AppState>,
    id: &str,
    status: &str,
) -> Result<Vec<RestaurantTransactionModel>, String> {
    let result = RestaurantTransactions::find()
        .filter(RestaurantTransactionColumn::RestaurantId.eq(id.to_owned()))
        .filter(RestaurantTransactionColumn::Status.eq(status.to_owned()))
        .all(&state.conn)
        .await;

    match result {
        Ok(transactions) => Ok(transactions),
        Err(err) => {
            eprintln!("Failed to get restaurant transaction: {:?}", err);
            Err(format!("Failed to get restaurant transaction: {:?}", err))
        }
    }
}

pub async fn get_current_user_restaurant_transactions(
    state: &State<'_, AppState>,
) -> Result<Vec<RestaurantTransactionModel>, String> {
    let current_user = state.current_user.lock().await;

    match &*current_user {
        Some(UserType::Customer(customer)) => {
            let customer_id = customer.id.clone();

            let result = RestaurantTransactions::find()
                .filter(RestaurantTransactionColumn::CustomerId.eq(customer_id))
                .all(&state.conn)
                .await;

            match result {
                Ok(transactions) => Ok(transactions),
                Err(err) => {
                    eprintln!("Failed to get restaurant transactions for user: {:?}", err);
                    Err(format!(
                        "Failed to get restaurant transactions for user: {:?}",
                        err
                    ))
                }
            }
        }
        Some(UserType::Staff(_)) => Err(String::from(
            "Staff members do not have restaurant transactions!",
        )),
        None => Err(String::from("User is not logged in!")),
    }
}

pub async fn delete_restaurant_transaction(
    state: &State<'_, AppState>,
    id: &str,
) -> Result<(), String> {
    let result = RestaurantTransactions::delete_many()
        .filter(RestaurantTransactionColumn::Id.eq(id.to_owned()))
        .exec(&state.conn)
        .await;

    match result {
        Ok(_) => Ok(()),
        Err(err) => {
            eprintln!("Failed to delete restaurant transaction: {:?}", err);
            Err(format!(
                "Failed to delete restaurant transaction: {:?}",
                err
            ))
        }
    }
}
