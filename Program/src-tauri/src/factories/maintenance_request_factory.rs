use chrono::Utc;
use sea_orm::ActiveValue;

use crate::models::maintenance_request::ActiveModel as MaintenanceRequestActiveModel;

pub fn create_maintenance_request(
    id: String,
    title: String,
    content: String,
) -> MaintenanceRequestActiveModel {
    MaintenanceRequestActiveModel {
        id: ActiveValue::Set(id),
        title: ActiveValue::Set(title),
        content: ActiveValue::Set(content),
        created_at: ActiveValue::Set(Utc::now().naive_utc()),
    }
}
