use sea_orm::{ColumnTrait, EntityTrait, QueryFilter};
use tauri::State;

use super::customer_repository::AppState;
use crate::models::souvenir::{
    ActiveModel as SouvenirActiveModel, Column as SouvenirColumn, Entity as Souvenirs,
    Model as SouvenirModel,
};

pub async fn insert_souvenir(
    state: &State<'_, AppState>,
    souvenir: SouvenirActiveModel,
) -> Result<(), String> {
    let result = Souvenirs::insert(souvenir).exec(&state.conn).await;

    if result.is_ok() {
        Ok(())
    } else {
        Err("Failed to insert souvenir item".to_string())
    }
}

pub async fn get_souvenirs(state: &State<'_, AppState>) -> Result<Vec<SouvenirModel>, String> {
    let result = Souvenirs::find().all(&state.conn).await;

    match result {
        Ok(souvenirs) => Ok(souvenirs),
        Err(err) => {
            eprintln!("Error getting souvenirs: {:?}", err);
            Err("Failed to get souvenirs".to_string())
        }
    }
}

pub async fn find_souvenir_by_id(
    state: &State<'_, AppState>,
    id: &str,
) -> Result<Option<SouvenirModel>, String> {
    Souvenirs::find()
        .filter(SouvenirColumn::Id.contains(id))
        .one(&state.conn)
        .await
        .map_err(|err| format!("Failed to find souvenir by ID: {}", err))
}

pub async fn get_souvenirs_by_store_id(
    state: &State<'_, AppState>,
    store_id: &str,
) -> Result<Vec<SouvenirModel>, String> {
    Souvenirs::find()
        .filter(SouvenirColumn::StoreId.eq(store_id))
        .all(&state.conn)
        .await
        .map_err(|err| format!("Failed to find souvenirs by store ID: {}", err))
}

pub async fn delete_souvenir(state: &State<'_, AppState>, souvenir_id: &str) -> Result<(), String> {
    let result = Souvenirs::delete_many()
        .filter(SouvenirColumn::Id.eq(souvenir_id))
        .exec(&state.conn)
        .await;

    match result {
        Ok(_) => Ok(()),
        Err(err) => Err(format!("Failed to delete souvenir: {}", err)),
    }
}
