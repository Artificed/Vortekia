use sea_orm::ActiveModelTrait;
use sea_orm::ColumnTrait;
use sea_orm::EntityTrait;
use sea_orm::QueryFilter;
use tauri::State;

use super::customer_repository::AppState;
use crate::models::ride::ActiveModel as RideActiveModel;
use crate::models::ride::Column as RideColumn;
use crate::models::ride::Entity as Rides;
use crate::models::ride::Model as RideModel;

pub async fn insert_ride(state: &State<'_, AppState>, ride: RideActiveModel) -> Result<(), String> {
    let result = Rides::insert(ride).exec(&state.conn).await;

    if result.is_ok() {
        Ok(())
    } else {
        Err("Failed to insert ride!".to_string())
    }
}

pub async fn get_all_rides(state: &State<'_, AppState>) -> Result<Vec<RideModel>, String> {
    let result = Rides::find()
        .filter(RideColumn::IsActive.eq(1))
        .all(&state.conn)
        .await;

    match result {
        Ok(rides) => Ok(rides),
        Err(err) => {
            eprintln!("Error getting rides: {:?}", err);
            Err("Failed to get rides!".to_string())
        }
    }
}

pub async fn get_ride_by_id(
    state: &State<'_, AppState>,
    id: &str,
) -> Result<Option<RideModel>, String> {
    let result = Rides::find()
        .filter(RideColumn::Id.eq(id))
        .filter(RideColumn::IsActive.eq(1))
        .one(&state.conn)
        .await;

    match result {
        Ok(ride) => Ok(ride),
        Err(err) => {
            eprintln!("Error fetching ride by ID: {:?}", err);
            Err("Failed to get ride!".to_string())
        }
    }
}

pub async fn delete_ride(state: &State<'_, AppState>, id: &str) -> Result<(), String> {
    let existing_ride = Rides::find_by_id(id).one(&state.conn).await;

    match existing_ride {
        Ok(Some(ride)) => {
            let mut ride_to_update: RideActiveModel = ride.into();
            ride_to_update.is_active = sea_orm::ActiveValue::Set(0);

            let result = ride_to_update.update(&state.conn).await;
            match result {
                Ok(_) => Ok(()),
                Err(err) => {
                    eprintln!("Error soft deleting ride: {:?}", err);
                    Err("Failed to soft delete ride!".to_string())
                }
            }
        }
        Ok(None) => Err("Ride not found!".to_string()),
        Err(err) => {
            eprintln!("Error finding ride: {:?}", err);
            Err("Failed to find ride!".to_string())
        }
    }
}

pub async fn update_ride(
    state: &State<'_, AppState>,
    id: &str,
    updated_ride: RideActiveModel,
) -> Result<(), String> {
    let existing_ride = Rides::find_by_id(id)
        .filter(RideColumn::IsActive.eq(1))
        .one(&state.conn)
        .await;

    match existing_ride {
        Ok(Some(ride)) => {
            let mut ride_to_update: RideActiveModel = ride.into();

            ride_to_update.name = updated_ride.name;
            ride_to_update.price = updated_ride.price;
            ride_to_update.status = updated_ride.status;
            ride_to_update.assigned_staff = updated_ride.assigned_staff;
            ride_to_update.image = updated_ride.image;
            ride_to_update.opening_time = updated_ride.opening_time;
            ride_to_update.closing_time = updated_ride.closing_time;

            let result = ride_to_update.update(&state.conn).await;
            match result {
                Ok(_) => Ok(()),
                Err(err) => {
                    eprintln!("Error updating ride: {:?}", err);
                    Err("Failed to update ride!".to_string())
                }
            }
        }
        Ok(None) => Err("Active ride not found!".to_string()),
        Err(err) => {
            eprintln!("Error finding ride: {:?}", err);
            Err("Failed to find ride!".to_string())
        }
    }
}
