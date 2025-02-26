use crate::{
    factories::customer_factory,
    modules::{app_state::AppState, user_type::UserType},
    repositories::customer_repository,
};
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
