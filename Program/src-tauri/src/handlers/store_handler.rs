use chrono::NaiveTime;
use tauri::State;

use crate::factories::store_factory;
use crate::models::store::ActiveModel as StoreActiveModel;
use crate::models::store::Model as StoreModel;
use crate::repositories::staff_schedule_repository;
use crate::{modules::app_state::AppState, repositories::store_repository};

use super::file_handler;
use super::staff_schedule_handler;

pub async fn insert_new_store(
    state: &State<'_, AppState>,
    store_name: String,
    opening_time: String,
    closing_time: String,
    description: String,
    image: String,
) -> Result<(), String> {
    let store =
        store_factory::create_store(image, store_name, description, opening_time, closing_time);

    store_repository::insert_store(state, store).await
}

pub async fn get_all_stores(state: &State<'_, AppState>) -> Result<Vec<StoreModel>, String> {
    store_repository::get_all_stores(state).await
}

pub async fn update_staff_schedule_for_store(
    state: &State<'_, AppState>,
    old_store_name: &str,
    new_store_name: &str,
    old_staff_id: Option<&str>,
    new_staff_id: &str,
    opening_time: &str,
    closing_time: &str,
) -> Result<(), String> {
    if let Some(old_id) = old_staff_id {
        if old_id != new_staff_id {
            let old_staff_schedules =
                staff_schedule_handler::get_staff_schedule_from_staff_id(state, old_id).await?;
            let task_name = format!("Assigned To Store {}", old_store_name);
            for schedule in old_staff_schedules {
                if schedule.task == task_name {
                    staff_schedule_repository::delete_staff_schedule(state, &schedule.id)
                        .await
                        .map_err(|e| format!("Failed to delete old staff schedule: {}", e))?;
                    break;
                }
            }
        } else {
            let staff_schedules =
                staff_schedule_handler::get_staff_schedule_from_staff_id(state, new_staff_id)
                    .await?;
            let old_task_name = format!("Assigned To Store {}", old_store_name);
            for schedule in staff_schedules {
                if schedule.task == old_task_name {
                    staff_schedule_repository::delete_staff_schedule(state, &schedule.id)
                        .await
                        .map_err(|e| format!("Failed to delete old staff schedule: {}", e))?;
                    break;
                }
            }
        }
    }

    staff_schedule_handler::insert_staff_schedule(
        state,
        new_staff_id,
        opening_time,
        closing_time,
        format!("Assigned To Store {}", new_store_name).as_str(),
    )
    .await
}

pub async fn update_store(
    state: &State<'_, AppState>,
    store_id: String,
    name: String,
    opening_time: String,
    closing_time: String,
    description: String,
    image_name: Option<String>,
    image_bytes: Option<Vec<u8>>,
    sales_associate: Option<String>,
) -> Result<(), String> {
    let existing = match store_repository::get_store_by_id(state, &store_id).await {
        Ok(s) => s,
        Err(err) => return Err(format!("Store with ID {} not found: {}", store_id, err)),
    };

    let url = if let (Some(name), Some(bytes)) = (image_name, image_bytes) {
        match file_handler::upload_image_to_firebase(&name, &bytes).await {
            Ok(url) => url,
            Err(e) => return Err(format!("Failed to upload image: {}", e)),
        }
    } else {
        existing.image.clone()
    };

    let opening = NaiveTime::parse_from_str(&opening_time, "%H:%M:%S")
        .map_err(|_| "Invalid opening time format!".to_string())?;
    let closing = NaiveTime::parse_from_str(&closing_time, "%H:%M:%S")
        .map_err(|_| "Invalid closing time format!".to_string())?;

    if let Some(staff_id) = &sales_associate {
        let existing_task = format!("Assigned To Store {}", existing.name);

        staff_schedule_handler::validate_staff_schedule(
            state,
            staff_id,
            &opening_time,
            &closing_time,
            Some(existing_task.as_str()),
        )
        .await?;

        update_staff_schedule_for_store(
            state,
            &existing.name,
            &name,
            existing.sales_associate.as_deref(),
            staff_id,
            &opening_time,
            &closing_time,
        )
        .await?;
    }

    let store_active_model: StoreActiveModel = existing.into();

    store_repository::update_store(
        state,
        store_active_model,
        name,
        url,
        description,
        opening,
        closing,
        sales_associate,
    )
    .await
}

pub async fn delete_store(state: &State<'_, AppState>, store_id: String) -> Result<(), String> {
    store_repository::delete_store(state, &store_id).await
}
