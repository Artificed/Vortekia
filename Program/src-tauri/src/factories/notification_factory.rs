use super::id_factory;
use crate::models::notification::ActiveModel as NotificationActiveModel;
use chrono::Utc;
use sea_orm::ActiveValue;

pub fn create_notification(receiver_id: String, message: String) -> NotificationActiveModel {
    let id = id_factory::generate_customer_id();
    let sent_time = Utc::now().naive_utc();

    NotificationActiveModel {
        id: ActiveValue::Set(id.to_string()),
        receiver_id: ActiveValue::Set(receiver_id),
        message: ActiveValue::Set(message),
        sent_time: ActiveValue::Set(sent_time),
    }
}
