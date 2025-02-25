use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize, Clone)]
pub enum UiType {
    Staff,
    Ride,
    Restaurant,
    Store,
    Customer,
}
