use sea_orm::EntityTrait;
use tauri::State;

use crate::models::lost_and_found_log::ActiveModel as LnfLogActiveModel;
use crate::models::lost_and_found_log::Entity as LnfLogs;

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
