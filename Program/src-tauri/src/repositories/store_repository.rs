use chrono::NaiveTime;
use sea_orm::ActiveModelTrait;
use sea_orm::ActiveValue;
use tauri::State;

use crate::models::store::ActiveModel as StoreActiveModel;
use crate::models::store::Column as StoreColumn;
use crate::models::store::Entity as Stores;
use crate::models::store::Model as StoreModel;
use crate::modules::app_state::AppState;
use sea_orm::{ColumnTrait, EntityTrait, QueryFilter};

pub async fn insert_store(
    state: &State<'_, AppState>,
    store: StoreActiveModel,
) -> Result<(), String> {
    let result = Stores::insert(store).exec(&state.conn).await;

    match result {
        Ok(_) => Ok(()),
        Err(err) => {
            eprintln!("Failed to insert new store: {:?}", err);
            Err(format!("Failed to insert new store: {:?}", err))
        }
    }
}

pub async fn get_all_stores(state: &State<'_, AppState>) -> Result<Vec<StoreModel>, String> {
    let result = Stores::find()
        .filter(StoreColumn::IsActive.eq(1))
        .all(&state.conn)
        .await;

    match result {
        Ok(store_list) => Ok(store_list),
        Err(err) => {
            eprintln!("Failed to get store list: {:?}", err);
            Err(format!("Failed to get store list: {:?}", err))
        }
    }
}

pub async fn get_store_by_id(state: &State<'_, AppState>, id: &str) -> Result<StoreModel, String> {
    let result = Stores::find()
        .filter(StoreColumn::Id.eq(id.to_owned()))
        .filter(StoreColumn::IsActive.eq(1))
        .one(&state.conn)
        .await;

    match result {
        Ok(Some(store)) => Ok(store),
        Ok(None) => Err(format!("Store with ID {} not found", id)),
        Err(err) => {
            eprintln!("Failed to get store: {:?}", err);
            Err(format!("Failed to get store: {:?}", err))
        }
    }
}

pub async fn get_staff_assigned_store(
    state: &State<'_, AppState>,
    staff_id: &str,
) -> Result<StoreModel, String> {
    let result = Stores::find()
        .filter(StoreColumn::SalesAssociate.eq(staff_id.to_owned()))
        .filter(StoreColumn::IsActive.eq(1))
        .one(&state.conn)
        .await;

    match result {
        Ok(Some(store)) => Ok(store),
        Ok(None) => Err(format!("Store with Staff ID {} not found", staff_id)),
        Err(err) => {
            eprintln!("Failed to get store: {:?}", err);
            Err(format!("Failed to get store: {:?}", err))
        }
    }
}

pub async fn update_store(
    state: &State<'_, AppState>,
    mut store: StoreActiveModel,
    name: String,
    image: String,
    description: String,
    opening_time: NaiveTime,
    closing_time: NaiveTime,
    sales_associate: Option<String>,
) -> Result<(), String> {
    store.name = ActiveValue::Set(name);
    store.image = ActiveValue::Set(image);
    store.description = ActiveValue::Set(description);
    store.opening_time = ActiveValue::Set(opening_time);
    store.closing_time = ActiveValue::Set(closing_time);
    store.sales_associate = ActiveValue::Set(sales_associate);

    let result = store.update(&state.conn).await;
    match result {
        Ok(_) => Ok(()),
        Err(err) => {
            eprintln!("Failed to update store: {:?}", err);
            Err(format!("Failed to update store: {:?}", err))
        }
    }
}

pub async fn delete_store(state: &State<'_, AppState>, id: &str) -> Result<(), String> {
    let store = get_store_by_id(state, id).await?;
    let mut active_store: StoreActiveModel = store.into();

    active_store.is_active = ActiveValue::Set(0);

    let result = active_store.update(&state.conn).await;
    match result {
        Ok(_) => Ok(()),
        Err(err) => {
            eprintln!("Failed to delete (deactivate) store: {:?}", err);
            Err(format!("Failed to delete (deactivate) store: {:?}", err))
        }
    }
}
