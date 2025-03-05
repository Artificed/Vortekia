use chrono::Utc;
use sea_orm::ActiveValue;

use crate::models::maintenance_log::ActiveModel as MaintenanceLogActiveModel;

pub fn create_maintenance_log(
    id: String,
    task_id: String,
    message: String,
) -> MaintenanceLogActiveModel {
    MaintenanceLogActiveModel {
        id: ActiveValue::Set(id),
        task_id: ActiveValue::Set(task_id),
        message: ActiveValue::Set(message),
        approved: ActiveValue::Set(0),
        done: ActiveValue::Set(0),
        created_at: ActiveValue::Set(Utc::now().naive_utc()),
    }
}
