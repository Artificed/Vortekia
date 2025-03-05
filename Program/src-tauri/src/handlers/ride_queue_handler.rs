use crate::models::ride_queue::Model as RideQueueModel;
use crate::repositories::ride_repository;
use crate::viewmodels::ride_with_queue::RideWithQueue;
use crate::{
    factories::ride_queue_factory,
    models::ride_queue::{Column as RideQueueColumn, Entity as RideQueues},
    modules::app_state::AppState,
    repositories::ride_queue_repository,
};

use chrono::NaiveDateTime;
use sea_orm::{ColumnTrait, Condition, EntityTrait, QueryFilter};
use tauri::State;

pub async fn validate_ride_queue_conflict(
    state: &State<'_, AppState>,
    ride_id: &str,
    new_start: NaiveDateTime,
    new_end: NaiveDateTime,
    exclude_id: Option<&str>,
) -> Result<(), String> {
    let mut query = RideQueues::find()
        .filter(RideQueueColumn::RideId.eq(ride_id.to_owned()))
        .filter(
            Condition::all()
                .add(RideQueueColumn::StartTime.lt(new_end))
                .add(RideQueueColumn::EndTime.gt(new_start)),
        );

    if let Some(exclude) = exclude_id {
        query = query.filter(RideQueueColumn::Id.ne(exclude.to_owned()));
    }

    let conflicts = query.all(&state.conn).await.map_err(|err| {
        eprintln!("Failed to validate ride queue conflict: {:?}", err);
        format!("Failed to validate ride queue conflict: {:?}", err)
    })?;

    if !conflicts.is_empty() {
        return Err("Time slot conflicts with an existing ride queue".into());
    }
    Ok(())
}

pub async fn insert_ride_queue(
    state: &State<'_, AppState>,
    ride_id: &str,
    customer_id: &str,
    start_time: NaiveDateTime,
    end_time: NaiveDateTime,
) -> Result<(), String> {
    validate_ride_queue_conflict(state, ride_id, start_time, end_time, None).await?;

    let new_ride_queue =
        ride_queue_factory::create_ride_queue(ride_id, customer_id, start_time, end_time);

    let result = ride_queue_repository::insert_ride_queue(state, new_ride_queue).await;

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

pub async fn update_ride_queue(
    state: &State<'_, AppState>,
    id: &str,
    ride_id: &str,
    customer_id: &str,
    start_time: String,
    end_time: String,
) -> Result<(), String> {
    let existing_queue = RideQueues::find()
        .filter(RideQueueColumn::Id.eq(id))
        .one(&state.conn)
        .await
        .map_err(|err| {
            eprintln!("Failed to fetch existing ride queue: {:?}", err);
            format!("Failed to fetch existing ride queue: {:?}", err)
        })?
        .ok_or_else(|| format!("Ride queue with ID {} not found", id))?;

    let ride = ride_repository::get_ride_by_id(state, ride_id)
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

    validate_ride_queue_conflict(state, ride_id, start, end, Some(id)).await?;

    let updated_ride_queue =
        ride_queue_factory::create_ride_queue(ride_id, customer_id, start, end);

    ride_queue_repository::insert_ride_queue(state, updated_ride_queue).await?;

    ride_queue_repository::delete_ride_queue(state, &existing_queue.id).await?;

    Ok(())
}

pub async fn get_ride_with_queue(
    state: &State<'_, AppState>,
    ride_id: &str,
) -> Result<RideWithQueue, String> {
    ride_queue_repository::get_ride_with_queue(state, ride_id).await
}

pub async fn get_all_rides_with_queues(
    state: &State<'_, AppState>,
) -> Result<Vec<RideWithQueue>, String> {
    ride_queue_repository::get_all_rides_with_queues(state).await
}

pub async fn delete_ride_queue(state: &State<'_, AppState>, id: &str) -> Result<(), String> {
    ride_queue_repository::delete_ride_queue(state, id).await
}
