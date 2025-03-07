use crate::factories::notification_factory;
use crate::models::notification::Model as NotificationModel;
use crate::modules::app_state::AppState;
use crate::repositories::notification_repository;
use tauri::State;

pub async fn insert_new_notification(
    state: &State<'_, AppState>,
    receiver_id: String,
    message: String,
) -> Result<(), String> {
    let notification = notification_factory::create_notification(receiver_id, message);
    notification_repository::insert_notification(state, notification).await
}

pub async fn get_all_notifications(
    state: &State<'_, AppState>,
) -> Result<Vec<NotificationModel>, String> {
    notification_repository::get_all_notifications(state).await
}

pub async fn get_notification_by_id(
    state: &State<'_, AppState>,
    id: String,
) -> Result<NotificationModel, String> {
    notification_repository::get_notification_by_id(state, &id).await
}

pub async fn delete_notification(state: &State<'_, AppState>, id: String) -> Result<(), String> {
    notification_repository::delete_notification(state, &id).await
}
