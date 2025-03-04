use chrono::NaiveDateTime;
use sea_orm::ActiveValue;

use crate::models::ride_queue::ActiveModel as RideQueueActiveModel;

use super::id_factory;

pub fn create_ride_queue(
    ride_id: &str,
    customer_id: &str,
    start_time: NaiveDateTime,
    end_time: NaiveDateTime,
) -> RideQueueActiveModel {
    let queue_id = id_factory::generate_customer_id();

    RideQueueActiveModel {
        id: ActiveValue::Set(queue_id),
        ride_id: ActiveValue::Set(ride_id.to_string()),
        customer_id: ActiveValue::Set(customer_id.to_string()),
        start_time: ActiveValue::Set(start_time),
        end_time: ActiveValue::Set(end_time),
    }
}
