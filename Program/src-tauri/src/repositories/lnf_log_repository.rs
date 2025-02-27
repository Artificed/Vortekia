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
