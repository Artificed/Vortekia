use tauri::State;

use crate::{factories::ride_factory, modules::app_state::AppState, repositories::ride_repository};

pub async fn insert_ride(
    state: &State<'_, AppState>,
    image: &str,
    name: &str,
    price: i32,
) -> Result<(), String> {
    let ride = ride_factory::create_ride(image, name, price);
    ride_repository::insert_ride(&state, ride).await
}
