use sea_orm::ColumnTrait;
use sea_orm::EntityTrait;
use sea_orm::QueryFilter;
use tauri::State;

use super::customer_repository::AppState;
use crate::models::staff::ActiveModel as StaffActiveModel;
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

pub async fn get_lnf_staff(state: &State<'_, AppState>) -> Result<Vec<StaffModel>, String> {
    let result = Staffs::find()
        .filter(StaffColumn::Role.contains("Lost and Found Staff"))
        .all(&state.conn)
        .await;

    match result {
        Ok(staffs) => Ok(staffs),
        Err(err) => {
            eprintln!("Error getting lost and found staffs: {:?}", err);
            Err("Failed to get all lost and found staffs".to_string())
        }
    }
}

pub async fn insert_staff(
    state: &State<'_, AppState>,
    staff: StaffActiveModel,
) -> Result<(), String> {
    let result = Staffs::insert(staff).exec(&state.conn).await;

    if result.is_ok() {
        Ok(())
    } else {
        Err("Failed to insert customer".to_string())
    }
}
