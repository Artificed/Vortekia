use sea_orm::ActiveModelTrait;
use sea_orm::ActiveValue;
use sea_orm::ColumnTrait;
use sea_orm::EntityTrait;
use sea_orm::QueryFilter;
use tauri::State;

pub use crate::models::customer::ActiveModel as CustomerActiveModel;
pub use crate::models::customer::Column as CustomerColumn;
pub use crate::models::customer::Entity as Customers;
pub use crate::models::customer::Model as CustomerModel;
pub use crate::modules::app_state::AppState;

pub use crate::models::customer::Entity as Customer;

pub async fn insert_customer(
    state: State<'_, AppState>,
    customer: CustomerActiveModel,
) -> Result<(), String> {
    let result = Customers::insert(customer).exec(&state.conn).await;

    if result.is_ok() {
        Ok(())
    } else {
        Err("Failed to insert customer".to_string())
    }
}

pub async fn update_customer_balance(
    state: &State<'_, AppState>,
    customer_id: String,
    new_balance: i32,
) -> Result<(), String> {
    let customer = Customers::find_by_id(customer_id)
        .one(&state.conn)
        .await
        .map_err(|e| format!("Failed to find customer: {}", e))?
        .ok_or_else(|| String::from("Customer not found"))?;

    let mut active_customer: CustomerActiveModel = customer.into();
    active_customer.balance = ActiveValue::Set(new_balance);

    active_customer
        .update(&state.conn)
        .await
        .map_err(|e| format!("Database update failed: {}", e))?;

    Ok(())
}

pub async fn get_all_customers(state: &State<'_, AppState>) -> Result<Vec<CustomerModel>, String> {
    let result = Customers::find().all(&state.conn).await;

    match result {
        Ok(customers) => Ok(customers),
        Err(err) => {
            eprintln!("Error getting all customers: {:?}", err);
            Err("Failed to get all customers".to_string())
        }
    }
}

pub async fn get_customer_from_id(
    state: &State<'_, AppState>,
    id: &str,
) -> Result<Option<CustomerModel>, String> {
    let result = Customers::find()
        .filter(CustomerColumn::Id.contains(id))
        .one(&state.conn)
        .await;

    match result {
        Ok(user) => Ok(user),
        Err(_) => Err("Failed to get customer".to_string()),
    }
}
