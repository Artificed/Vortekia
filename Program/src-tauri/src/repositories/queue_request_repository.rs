use sea_orm::ActiveModelTrait;
use tauri::State;

use crate::models::queue_request::ActiveModel as QueueRequestActiveModel;
use crate::models::queue_request::Column as QueueRequestColumn;
use crate::models::queue_request::Entity as QueueRequests;
use crate::models::queue_request::Model as QueueRequestModel;
use crate::modules::app_state::AppState;
use sea_orm::{ColumnTrait, EntityTrait, QueryFilter};

pub async fn insert_queue_request(
    state: &State<'_, AppState>,
    queue_request: QueueRequestActiveModel,
) -> Result<(), String> {
    let result = QueueRequests::insert(queue_request).exec(&state.conn).await;

    match result {
        Ok(_) => Ok(()),
        Err(err) => {
            eprintln!("Failed to insert queue request: {:?}", err);
            Err(format!("Failed to insert queue request: {:?}", err))
        }
    }
}

pub async fn get_all_queue_requests(
    state: &State<'_, AppState>,
) -> Result<Vec<QueueRequestModel>, String> {
    let result = QueueRequests::find().all(&state.conn).await;

    match result {
        Ok(requests) => Ok(requests),
        Err(err) => {
            eprintln!("Failed to get all queue requests: {:?}", err);
            Err(format!("Failed to get all queue requests: {:?}", err))
        }
    }
}

pub async fn get_queue_request(state: &AppState, id: &str) -> Result<QueueRequestModel, String> {
    let result = QueueRequests::find()
        .filter(QueueRequestColumn::Id.eq(id.to_owned()))
        .one(&state.conn)
        .await;

    match result {
        Ok(Some(request)) => Ok(request),
        Ok(None) => Err(format!("Queue request with ID {} not found", id)),
        Err(err) => {
            eprintln!("Failed to get queue request: {:?}", err);
            Err(format!("Failed to get queue request: {:?}", err))
        }
    }
}

pub async fn get_queue_requests_by_ride(
    state: &State<'_, AppState>,
    ride_id: &str,
) -> Result<Vec<QueueRequestModel>, String> {
    let result = QueueRequests::find()
        .filter(QueueRequestColumn::RideId.eq(ride_id.to_owned()))
        .all(&state.conn)
        .await;

    match result {
        Ok(requests) => Ok(requests),
        Err(err) => {
            eprintln!("Failed to get queue requests by ride: {:?}", err);
            Err(format!("Failed to get queue requests by ride: {:?}", err))
        }
    }
}

//
// pub async fn update_queue_request_approval(
//     state: &State<'_, AppState>,
//     id: &str,
//     approve: i8,
// ) -> Result<String, String> {
//     let request = QueueRequests::find()
//         .filter(QueueRequestColumn::Id.eq(id))
//         .one(&state.conn)
//         .await;
//
//     match request {
//         Ok(Some(request)) => {
//             let mut request_active: QueueRequestActiveModel = request.into();
//
//             // Capture ride_id (or any other field you may need)
//             let ride_id = request.ride_id;
//
//             request_active.approved = Set(approve);
//             request_active.done = Set(1);
//
//             let result = request_active.update(&state.conn).await;
//             match result {
//                 Ok(_) => Ok(ride_id),
//                 Err(err) => {
//                     eprintln!("Failed to update queue request approval status: {:?}", err);
//                     Err(format!(
//                         "Failed to update queue request approval status: {:?}",
//                         err
//                     ))
//                 }
//             }
//         }
//         Ok(None) => Err(format!("Queue request with ID {} not found", id)),
//         Err(err) => {
//             eprintln!("Failed to find queue request: {:?}", err);
//             Err(format!("Failed to find queue request: {:?}", err))
//         }
//     }
// }
