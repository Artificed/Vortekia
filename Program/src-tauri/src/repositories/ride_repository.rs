use sea_orm::EntityTrait;
use tauri::State;

use super::customer_repository::AppState;
use crate::models::ride::ActiveModel as RideActiveModel;
use crate::models::ride::Entity as Rides;

pub async fn insert_ride(state: &State<'_, AppState>, ride: RideActiveModel) -> Result<(), String> {
    let result = Rides::insert(ride).exec(&state.conn).await;

    if result.is_ok() {
        Ok(())
    } else {
        Err("Failed to insert ride!".to_string())
    }
}
