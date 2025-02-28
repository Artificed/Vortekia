use sea_orm::ActiveModelTrait;
use sea_orm::ActiveValue;
use sea_orm::EntityTrait;
use tauri::State;

use crate::models::lost_and_found_log::ActiveModel as LnfLogActiveModel;
use crate::models::lost_and_found_log::Entity as LnfLogs;
use crate::models::lost_and_found_log::Model as LnfLogModel;

use super::customer_repository::AppState;

pub async fn insert_lnf_log(
    state: State<'_, AppState>,
    lnf_log: LnfLogActiveModel,
) -> Result<(), String> {
    let result = LnfLogs::insert(lnf_log).exec(&state.conn).await;

    if result.is_ok() {
        Ok(())
    } else {
        Err("Failed to insert lost and found log".to_string())
    }
}

pub async fn get_lnf_logs(state: State<'_, AppState>) -> Result<Vec<LnfLogModel>, String> {
    let result = LnfLogs::find().all(&state.conn).await;

    match result {
        Ok(lnf_logs) => Ok(lnf_logs),
        Err(err) => {
            eprintln!("Error getting lost and found logs: {:?}", err);
            Err("Failed to get lost and found logs".to_string())
        }
    }
}

pub async fn update_lnf_log(
    state: State<'_, AppState>,
    id: &str,
    image: Option<String>,
    name: &str,
    r#type: &str,
    color: &str,
    last_seen_location: &str,
    finder: &str,
    owner: &str,
    status: &str,
) -> Result<(), String> {
    let log = LnfLogs::find_by_id(id)
        .one(&state.conn)
        .await
        .map_err(|_| "Failed to find the lost and found log".to_string())?;

    if let Some(existing_log) = log {
        let mut updated_log: LnfLogActiveModel = existing_log.into();

        if let Some(updated_image) = image {
            updated_log.image = ActiveValue::Set(Some(updated_image.to_string()));
        }

        updated_log.name = ActiveValue::Set(name.to_string());
        updated_log.name = ActiveValue::Set(name.to_string());
        updated_log.r#type = ActiveValue::Set(r#type.to_string());
        updated_log.color = ActiveValue::Set(color.to_string());
        updated_log.last_seen_location = ActiveValue::Set(last_seen_location.to_string());
        updated_log.finder = ActiveValue::Set(Some(finder.to_string()));
        updated_log.owner = ActiveValue::Set(owner.to_string());
        updated_log.status = ActiveValue::Set(status.to_string());

        updated_log.update(&state.conn).await.unwrap();

        Ok(())
    } else {
        Err("Lost and found log not found".to_string())
    }
}
