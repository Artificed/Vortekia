use chrono::Utc;
use sea_orm::ActiveValue;

use crate::models::maintenance_report::ActiveModel as MaintenanceReportActiveModel;

pub fn create_maintenance_report(
    id: String,
    title: String,
    content: String,
) -> MaintenanceReportActiveModel {
    MaintenanceReportActiveModel {
        id: ActiveValue::Set(id),
        title: ActiveValue::Set(title),
        content: ActiveValue::Set(content),
        created_at: ActiveValue::Set(Utc::now().naive_utc()),
    }
}
