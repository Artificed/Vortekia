use serde::{Deserialize, Serialize};

use crate::models::ride::Model as RideModel;
use crate::models::ride_queue::Model as RideQueueModel;

#[derive(Serialize, Deserialize)]
pub struct RideWithQueue {
    pub ride: RideModel,
    pub ride_queues: Vec<RideQueueModel>,
}
