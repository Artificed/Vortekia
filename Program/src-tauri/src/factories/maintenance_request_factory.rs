use chrono::Utc;
use sea_orm::ActiveValue;

use crate::models::maintenance_request::ActiveModel as MaintenanceRequestActiveModel;

use super::id_factory;

pub fn create_maintenance_request(title: String, content: String) -> MaintenanceRequestActiveModel {
    let id = id_factory::generate_customer_id();

    MaintenanceRequestActiveModel {
        id: ActiveValue::Set(id),
        title: ActiveValue::Set(title),
        content: ActiveValue::Set(content),
        approved: ActiveValue::Set(0),
        done: ActiveValue::Set(0),
        created_at: ActiveValue::Set(Utc::now().naive_utc()),
    }
}
