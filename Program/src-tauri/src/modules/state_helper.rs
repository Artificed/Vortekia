use tauri::State;

use super::app_state::AppState;

pub fn get_redis_conn(state: &State<'_, AppState>) -> Result<redis::Connection, String> {
    state
        .redis
        .get_connection()
        .map_err(|e| format!("Redis connection error: {}", e))
}
