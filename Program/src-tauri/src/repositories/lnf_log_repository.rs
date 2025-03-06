use redis::Commands;
use sea_orm::ActiveModelTrait;
use sea_orm::ActiveValue;
use sea_orm::ColumnTrait;
use sea_orm::EntityTrait;
use sea_orm::QueryFilter;
use tauri::State;

use crate::models::lost_and_found_log::ActiveModel as LnfLogActiveModel;
use crate::models::lost_and_found_log::Column as LnfColumn;
use crate::models::lost_and_found_log::Entity as LnfLogs;
use crate::models::lost_and_found_log::Model as LnfLogModel;
use crate::modules::state_helper;

use super::customer_repository::AppState;

const CACHE_TTL: u64 = 300;

pub async fn insert_lnf_log(
    state: State<'_, AppState>,
    lnf_log: LnfLogActiveModel,
) -> Result<(), String> {
    let log_id = lnf_log.id.clone().unwrap().to_string();
    let result = LnfLogs::insert(lnf_log).exec(&state.conn).await;

    if result.is_ok() {
        let mut redis_conn = state_helper::get_redis_conn(&state)?;

        let lnf_log_cache_key = format!("lnf_logs:{}", log_id);
        let _: () = redis_conn
            .del(&lnf_log_cache_key)
            .map_err(|e| format!("Redis cache invalidation error: {}", e))?;

        let _: () = redis_conn
            .del("all_lnf_logs")
            .map_err(|e| format!("Redis cache invalidation error: {}", e))?;
    }

    if result.is_ok() {
        Ok(())
    } else {
        Err("Failed to insert lost and found log".to_string())
    }
}

pub async fn get_lnf_logs(state: State<'_, AppState>) -> Result<Vec<LnfLogModel>, String> {
    let mut redis_conn = state_helper::get_redis_conn(&state)?;

    let cache_key = "all_lnf_logs";
    let cached: Option<String> = redis_conn
        .get(cache_key)
        .map_err(|e| format!("Redis get error: {}", e))?;

    if let Some(cached_data) = cached {
        match serde_json::from_str::<Vec<LnfLogModel>>(&cached_data) {
            Ok(logs) => {
                return Ok(logs);
            }
            Err(e) => {
                eprintln!("Error deserializing cached lost and found log!: {:?}", e);
            }
        }
    }

    let result = LnfLogs::find().all(&state.conn).await;

    match result {
        Ok(lnf_logs) => {
            match serde_json::to_string(&lnf_logs) {
                Ok(json_string) => {
                    let _: () = redis_conn
                        .set_ex(cache_key, json_string, CACHE_TTL)
                        .map_err(|e| eprintln!("Redis cache update error: {:?}", e))
                        .unwrap_or(());
                }
                Err(e) => eprintln!("Error serializing logs for cache: {:?}", e),
            }
            Ok(lnf_logs)
        }
        Err(err) => {
            eprintln!("Error getting lost and found logs: {:?}", err);
            Err("Failed to get lost and found logs".to_string())
        }
    }
}

pub async fn find_lnf_log_by_id(
    state: &State<'_, AppState>,
    id: &str,
) -> Result<Option<LnfLogModel>, String> {
    let mut redis_conn = state_helper::get_redis_conn(state)?;

    let cache_key = format!("lnf_logs:{}", id);
    let cached: Option<String> = redis_conn
        .get(&cache_key)
        .map_err(|e| format!("Redis get error: {}", e))?;

    if let Some(cached_data) = cached {
        match serde_json::from_str::<LnfLogModel>(&cached_data) {
            Ok(log) => {
                return Ok(Some(log));
            }
            Err(e) => {
                eprintln!("Error deserializing cached lost and found log: {:?}", e);
            }
        }
    }

    let result = LnfLogs::find()
        .filter(LnfColumn::Id.contains(id))
        .one(&state.conn)
        .await;

    match result {
        Ok(maybe_log) => {
            if let Some(ref log) = maybe_log {
                match serde_json::to_string(log) {
                    Ok(json_string) => {
                        let _: () = redis_conn
                            .set_ex(&cache_key, json_string, CACHE_TTL)
                            .map_err(|e| eprintln!("Redis cache update error: {:?}", e))
                            .unwrap_or(());
                    }
                    Err(e) => eprintln!("Error serializing log for cache: {:?}", e),
                }
            }

            Ok(maybe_log)
        }
        Err(err) => Err(format!("Failed to find lost and found log by ID: {}", err)),
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
    found_location: Option<String>,
    finder: Option<String>,
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

        if let Some(new_location) = found_location {
            updated_log.found_location = ActiveValue::Set(Some(new_location.to_string()));
        }

        if let Some(new_finder) = finder {
            updated_log.finder = ActiveValue::Set(Some(new_finder.to_string()));
        }

        updated_log.name = ActiveValue::Set(name.to_string());
        updated_log.r#type = ActiveValue::Set(r#type.to_string());
        updated_log.color = ActiveValue::Set(color.to_string());
        updated_log.last_seen_location = ActiveValue::Set(last_seen_location.to_string());
        updated_log.owner = ActiveValue::Set(owner.to_string());
        updated_log.status = ActiveValue::Set(status.to_string());

        let result = updated_log.update(&state.conn).await;

        if result.is_ok() {
            let mut redis_conn = state_helper::get_redis_conn(&state)?;

            let lnf_log_cache_key = format!("lnf_logs:{}", id);
            let _: () = redis_conn
                .del(&lnf_log_cache_key)
                .map_err(|e| format!("Redis cache invalidation error: {}", e))?;

            let _: () = redis_conn
                .del("all_lnf_logs")
                .map_err(|e| format!("Redis cache invalidation error: {}", e))?;

            Ok(())
        } else {
            Err("Failed to update lost and found log".to_string())
        }
    } else {
        Err("Lost and found log not found".to_string())
    }
}
