use crate::models::notification::{
    ActiveModel as NotificationActiveModel, Column as NotificationColumn, Entity as Notifications,
    Model as NotificationModel,
};
use crate::modules::app_state::AppState;
use sea_orm::{ColumnTrait, EntityTrait, QueryFilter};
use tauri::State;

pub async fn insert_notification(
    state: &State<'_, AppState>,
    notification: NotificationActiveModel,
) -> Result<(), String> {
    let result = Notifications::insert(notification).exec(&state.conn).await;

    match result {
        Ok(_) => Ok(()),
        Err(err) => {
            eprintln!("Failed to insert notification: {:?}", err);
            Err(format!("Failed to insert notification: {:?}", err))
        }
    }
}

pub async fn get_all_notifications(
    state: &State<'_, AppState>,
) -> Result<Vec<NotificationModel>, String> {
    let result = Notifications::find().all(&state.conn).await;

    match result {
        Ok(notifications) => Ok(notifications),
        Err(err) => {
            eprintln!("Failed to get all notifications: {:?}", err);
            Err(format!("Failed to get all notifications: {:?}", err))
        }
    }
}

pub async fn get_notification_by_id(
    state: &State<'_, AppState>,
    id: &str,
) -> Result<NotificationModel, String> {
    let result = Notifications::find()
        .filter(NotificationColumn::Id.eq(id.to_owned()))
        .one(&state.conn)
        .await;

    match result {
        Ok(Some(notification)) => Ok(notification),
        Ok(None) => Err(format!("Notification with ID {} not found", id)),
        Err(err) => {
            eprintln!("Failed to get notification: {:?}", err);
            Err(format!("Failed to get notification: {:?}", err))
        }
    }
}

pub async fn delete_notification(state: &State<'_, AppState>, id: &str) -> Result<(), String> {
    let result = Notifications::delete_many()
        .filter(NotificationColumn::Id.eq(id.to_owned()))
        .exec(&state.conn)
        .await;

    match result {
        Ok(_) => Ok(()),
        Err(err) => {
            eprintln!("Failed to delete notification: {:?}", err);
            Err(format!("Failed to delete notification: {:?}", err))
        }
    }
}
