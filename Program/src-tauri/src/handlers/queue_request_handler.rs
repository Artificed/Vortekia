use tauri::State;

use crate::repositories::{customer_repository, ride_repository};
use crate::{
    factories::queue_request_factory, modules::app_state::AppState,
    repositories::queue_request_repository,
};

use crate::models::queue_request::Model as QueueRequestModel;

use super::customer_handler;

pub async fn insert_new_queue_request(
    state: &State<'_, AppState>,
    ride_id: String,
    customer_id: String,
) -> Result<(), String> {
    let ride = ride_repository::get_ride_by_id(state, &ride_id).await?;

    if let Some(selected_ride) = ride {
        let ride_cost = selected_ride.price;
        let res = customer_handler::add_current_user_balance(state, ride_cost).await;

        let status = match res {
            Ok(()) => String::from("Pending"),
            Err(_) => String::from("Failed"),
        };

        // _ = restaurant_transaction_repository::insert_restaurant_transaction(state, transaction).await;
        //
        // if res.is_err() {
        //     Err("Insufficient balance to make transaction!".to_string())
        // } else {
        //     Ok(())
        // }

        let request = queue_request_factory::create_queue_request(&ride_id, &customer_id);
        queue_request_repository::insert_queue_request(state, request).await
    } else {
        return Err("Failed to get ride!".to_string());
    }
}

pub async fn get_all_queue_requests(
    state: &State<'_, AppState>,
) -> Result<Vec<QueueRequestModel>, String> {
    queue_request_repository::get_all_queue_requests(state).await
}

// pub async fn update_queue_request_approval(
//     state: &State<'_, AppState>,
//     id: String,
//     approve: i8,
// ) -> Result<(), String> {
//     let ride_id = queue_request_repository::update_queue_request_approval(state, &id, approve)
//         .await
//         .unwrap();
//
//     // Optionally, if you want to trigger additional ride-related actions on approval,
//     // you could add those here. For example, if approve == 1 { ride_repository::join_ride(state, &ride_id).await?; }
//
//     Ok(())
// }
