use chrono::Utc;
use sea_orm::ActiveValue;

use crate::models::maintenance_report::ActiveModel as MaintenanceReportActiveModel;

use super::id_factory;

pub fn create_maintenance_report(title: String, content: String) -> MaintenanceReportActiveModel {
    let id = id_factory::generate_customer_id();

    MaintenanceReportActiveModel {
        id: ActiveValue::Set(id),
        title: ActiveValue::Set(title),
        content: ActiveValue::Set(content),
        created_at: ActiveValue::Set(Utc::now().naive_utc()),
    }
}
