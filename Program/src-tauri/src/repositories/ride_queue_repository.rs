use futures::future::join_all;
use sea_orm::ColumnTrait;
use sea_orm::EntityTrait;
use sea_orm::QueryFilter;
use tauri::State;

use super::customer_repository::AppState;
use super::ride_repository;
use crate::models::ride_queue::ActiveModel as RideQueueActiveModel;
use crate::models::ride_queue::Column as RideQueueColumn;
use crate::models::ride_queue::Entity as RideQueues;
use crate::models::ride_queue::Model as RideQueueModel;
use crate::viewmodels::ride_with_queue::RideWithQueue;

pub async fn insert_ride_queue(
    state: &State<'_, AppState>,
    new_ride_queue: RideQueueActiveModel,
) -> Result<(), String> {
    let result = RideQueues::insert(new_ride_queue).exec(&state.conn).await;

    match result {
        Ok(_) => Ok(()),
        Err(err) => {
            eprintln!("Failed to insert ride queue: {:?}", err);
            Err(format!("Failed to insert ride queue: {:?}", err))
        }
    }
}

pub async fn get_all_ride_queues(
    state: &State<'_, AppState>,
) -> Result<Vec<RideQueueModel>, String> {
    let result = RideQueues::find().all(&state.conn).await;
    match result {
        Ok(queues) => Ok(queues),
        Err(err) => {
            eprintln!("Failed to get all ride queues: {:?}", err);
            Err(format!("Failed to get all ride queues: {:?}", err))
        }
    }
}

pub async fn get_ride_queue(
    state: &State<'_, AppState>,
    id: &str,
) -> Result<RideQueueModel, String> {
    let result = RideQueues::find()
        .filter(RideQueueColumn::Id.eq(id.to_owned()))
        .one(&state.conn)
        .await;

    match result {
        Ok(Some(queue)) => Ok(queue),
        Ok(None) => Err(format!("Ride queue with ID {} not found", id)),
        Err(err) => {
            eprintln!("Failed to get ride queue: {:?}", err);
            Err(format!("Failed to get ride queue: {:?}", err))
        }
    }
}

pub async fn get_ride_queues_by_ride(
    state: &State<'_, AppState>,
    ride_id: &str,
) -> Result<Vec<RideQueueModel>, String> {
    let result = RideQueues::find()
        .filter(RideQueueColumn::RideId.eq(ride_id.to_owned()))
        .all(&state.conn)
        .await;

    match result {
        Ok(queues) => Ok(queues),
        Err(err) => {
            eprintln!("Failed to get ride queues for ride {}: {:?}", ride_id, err);
            Err(format!(
                "Failed to get ride queues for ride {}: {:?}",
                ride_id, err
            ))
        }
    }
}

pub async fn get_ride_queues_by_customer(
    state: &State<'_, AppState>,
    customer_id: &str,
) -> Result<Vec<RideQueueModel>, String> {
    let result = RideQueues::find()
        .filter(RideQueueColumn::CustomerId.eq(customer_id.to_owned()))
        .all(&state.conn)
        .await;

    match result {
        Ok(queues) => Ok(queues),
        Err(err) => {
            eprintln!(
                "Failed to get ride queues for customer {}: {:?}",
                customer_id, err
            );
            Err(format!(
                "Failed to get ride queues for customer {}: {:?}",
                customer_id, err
            ))
        }
    }
}

pub async fn delete_ride_queue(state: &State<'_, AppState>, id: &str) -> Result<(), String> {
    let result = RideQueues::delete_many()
        .filter(RideQueueColumn::Id.eq(id.to_owned()))
        .exec(&state.conn)
        .await;

    match result {
        Ok(_) => Ok(()),
        Err(err) => {
            eprintln!("Failed to delete ride queue: {:?}", err);
            Err(format!("Failed to delete ride queue: {:?}", err))
        }
    }
}

pub async fn update_ride_queue(
    state: &State<'_, AppState>,
    updated_ride_queue: RideQueueActiveModel,
) -> Result<(), String> {
    let result = RideQueues::update(updated_ride_queue)
        .exec(&state.conn)
        .await;

    match result {
        Ok(_) => Ok(()),
        Err(err) => {
            eprintln!("Failed to update ride queue: {:?}", err);
            Err(format!("Failed to update ride queue: {:?}", err))
        }
    }
}

pub async fn get_ride_with_queue(
    state: &State<'_, AppState>,
    ride_id: &str,
) -> Result<RideWithQueue, String> {
    let ride_opt = ride_repository::get_ride_by_id(state, ride_id).await?;
    let ride = match ride_opt {
        Some(ride) => ride,
        None => return Err(format!("Ride with id {} not found", ride_id)),
    };

    let ride_queues = get_ride_queues_by_ride(state, ride_id).await?;

    Ok(RideWithQueue { ride, ride_queues })
}

pub async fn get_all_rides_with_queues(
    state: &State<'_, AppState>,
) -> Result<Vec<RideWithQueue>, String> {
    let rides = ride_repository::get_all_rides(state).await?;

    let ride_with_queue_futures = rides.into_iter().map(|ride| {
        let state_ref = state;
        let ride_id = ride.id.clone();
        async move {
            let ride_queues = get_ride_queues_by_ride(state_ref, &ride_id).await?;
            Ok(RideWithQueue { ride, ride_queues })
        }
    });

    let rides_with_queues_results = join_all(ride_with_queue_futures).await;

    rides_with_queues_results.into_iter().collect()
}
