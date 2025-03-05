use chrono::{NaiveDateTime, Utc};
use tauri::State;

use crate::factories::ride_transaction_factory;
use crate::repositories::{ride_repository, ride_transaction_repository};
use crate::{
    factories::queue_request_factory, modules::app_state::AppState,
    repositories::queue_request_repository,
};

use crate::models::queue_request::Model as QueueRequestModel;

use super::{customer_handler, ride_queue_handler};

pub async fn insert_new_queue_request(
    state: &State<'_, AppState>,
    ride_id: String,
    customer_id: String,
) -> Result<(), String> {
    let ride = ride_repository::get_ride_by_id(state, &ride_id).await?;
    let selected_ride = match ride {
        Some(r) => r,
        None => return Err("Failed to get ride!".to_string()),
    };

    let ride_cost = selected_ride.price;

    let balance_check = customer_handler::add_current_user_balance(state, ride_cost).await;
    if balance_check.is_err() {
        return Err("Insufficient balance to make transaction!".to_string());
    }

    let queue_request = queue_request_factory::create_queue_request(&ride_id, &customer_id);
    queue_request_repository::insert_queue_request(state, queue_request).await?;

    let transaction_date: NaiveDateTime = Utc::now().naive_utc();
    let ride_transaction = ride_transaction_factory::create_ride_transaction(
        customer_id,
        ride_id,
        selected_ride.price.abs(),
        transaction_date,
        "In Progress",
    );
    ride_transaction_repository::insert_ride_transaction(state, ride_transaction).await?;

    Ok(())
}

pub async fn get_all_queue_requests(
    state: &State<'_, AppState>,
) -> Result<Vec<QueueRequestModel>, String> {
    queue_request_repository::get_all_queue_requests(state).await
}

pub async fn get_queue_requests_by_ride(
    state: &State<'_, AppState>,
    ride_id: &str,
) -> Result<Vec<QueueRequestModel>, String> {
    queue_request_repository::get_queue_requests_by_ride(state, ride_id).await
}

pub async fn update_queue_request_approval(
    state: &State<'_, AppState>,
    id: String,
    approve: i8,
    start_time: String,
    end_time: String,
) -> Result<(), String> {
    let (ride_id, customer_id) =
        queue_request_repository::update_queue_request_approval(state, &id, approve).await?;

    let ride = ride_repository::get_ride_by_id(state, &ride_id)
        .await?
        .ok_or_else(|| "Ride not found".to_string())?;

    let start = NaiveDateTime::parse_from_str(&start_time, "%Y-%m-%d %H:%M:%S")
        .map_err(|e| format!("Failed to parse start_time: {}", e))?;
    let end = NaiveDateTime::parse_from_str(&end_time, "%Y-%m-%d %H:%M:%S")
        .map_err(|e| format!("Failed to parse end_time: {}", e))?;

    if start.time() < ride.opening_time || end.time() > ride.closing_time {
        return Err(format!(
            "Selected time must be between {} and {}",
            ride.opening_time, ride.closing_time
        ));
    }

    if approve == 1 {
        ride_queue_handler::insert_ride_queue(state, &ride_id, &customer_id, start, end).await?
    }

    Ok(())
}
