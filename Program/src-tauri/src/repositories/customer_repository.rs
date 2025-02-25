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
