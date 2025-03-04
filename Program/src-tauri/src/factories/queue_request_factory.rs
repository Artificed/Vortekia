use crate::models::queue_request::ActiveModel as QueueRequestActiveModel;
use sea_orm::ActiveValue;

use super::id_factory;

pub fn create_queue_request(ride_id: &str, customer_id: &str) -> QueueRequestActiveModel {
    let id = id_factory::generate_customer_id();
    let request_time = chrono::Local::now().naive_local();

    QueueRequestActiveModel {
        id: ActiveValue::Set(id),
        ride_id: ActiveValue::Set(ride_id.to_string()),
        customer_id: ActiveValue::Set(customer_id.to_string()),
        request_time: ActiveValue::Set(request_time),
        approved: ActiveValue::Set(0),
        done: ActiveValue::Set(0),
    }
}
