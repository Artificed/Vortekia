use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub enum UiType {
    Staff,
    Ride,
    Restaurant,
    Store,
    Customer,
}
