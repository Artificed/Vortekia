use sea_orm::ColumnTrait;
use sea_orm::EntityTrait;
use sea_orm::QueryFilter;
use tauri::State;

use super::customer_repository::AppState;
use crate::models::staff::Column as StaffColumn;
use crate::models::staff::Entity as Staffs;
use crate::models::staff::Model as StaffModel;

pub async fn get_staff_from_username(
    state: &State<'_, AppState>,
    username: &str,
) -> Result<Option<StaffModel>, String> {
    let result = Staffs::find()
        .filter(StaffColumn::Username.contains(username))
        .one(&state.conn)
        .await;

    match result {
        Ok(user) => Ok(user),
        Err(_) => Err("Failed to get staff!".to_string()),
    }
}
