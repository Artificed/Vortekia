use sea_orm::ActiveValue;

use crate::models::maintenance_task::ActiveModel as MaintenanceTaskActiveModel;

pub fn create_maintenance_task(
    id: String,
    name: String,
    description: String,
    assigned_staff: Option<String>,
    status: String,
) -> MaintenanceTaskActiveModel {
    MaintenanceTaskActiveModel {
        id: ActiveValue::Set(id),
        name: ActiveValue::Set(name),
        description: ActiveValue::Set(description),
        assigned_staff: ActiveValue::Set(assigned_staff),
        status: ActiveValue::Set(status),
    }
}
