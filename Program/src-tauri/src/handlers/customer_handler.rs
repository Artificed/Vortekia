use crate::{
    factories::customer_factory,
    modules::{app_state::AppState, user_type::UserType},
    repositories::customer_repository,
};

use crate::models::customer::Model as CustomerModel;

use sea_orm::ActiveValue;
use tauri::State;

pub async fn login_customer(state: State<'_, AppState>, id: &str) -> Result<(), String> {
    let customer = customer_repository::get_customer_from_id(&state, id)
        .await
        .map_err(|_| "Failed to fetch customer".to_string())?;

    if let Some(customer) = customer {
        let mut current_user = state.current_user.lock().await;
        *current_user = Some(UserType::Customer(customer));
        Ok(())
    } else {
        Err("Customer not found!".to_string())
    }
}

pub async fn register_customer(
    state: State<'_, AppState>,
    username: String,
    balance: i32,
) -> Result<String, String> {
    let new_user = customer_factory::create_customer(&username, balance);
    let res = customer_repository::insert_customer(state, new_user.clone()).await;

    match res {
        Ok(_) => match new_user.id {
            ActiveValue::Set(id) => Ok(id),
            _ => Err("Failed to get customer ID".to_string()),
        },
        Err(e) => Err(format!("Database error: {:?}", e)),
    }
}

pub async fn add_current_user_balance(
    state: &State<'_, AppState>,
    balance: i32,
) -> Result<(), String> {
    let mut current_user = state.current_user.lock().await;

    match &*current_user {
        Some(UserType::Customer(customer)) => {
            let customer_id = customer.id.clone();
            let current_balance = customer.balance;

            if balance < 0 && current_balance < balance.abs() {
                return Err(String::from("Insufficient balance!"));
            }

            let new_balance = current_balance + balance;

            match customer_repository::update_customer_balance(
                state,
                customer_id.clone(),
                new_balance,
            )
            .await
            {
                Ok(_) => {
                    *current_user = Some(UserType::Customer(CustomerModel {
                        id: customer_id,
                        username: customer.username.clone(),
                        balance: new_balance,
                    }));
                    Ok(())
                }
                Err(e) => Err(e),
            }
        }
        Some(UserType::Staff(_)) => Err(String::from("Only customers can update balance!")),
        None => Err(String::from("User is not logged in!")),
    }
}

pub async fn get_all_customers(state: State<'_, AppState>) -> Result<Vec<CustomerModel>, String> {
    customer_repository::get_all_customers(&state).await
}
