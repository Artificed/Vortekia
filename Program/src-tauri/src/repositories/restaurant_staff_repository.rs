use sea_orm::{ColumnTrait, EntityTrait, QueryFilter};
use tauri::State;

use crate::models::restaurant::Model as RestaurantModel;
use crate::models::restaurant_staff::{
    ActiveModel as RestaurantStaffActiveModel, Column as RestaurantStaffColumn,
    Entity as RestaurantStaffs, Model as RestaurantStaffModel,
};
use crate::modules::app_state::AppState;

use super::restaurant_repository;

pub async fn insert_restaurant_staff(
    state: &State<'_, AppState>,
    new_staff: RestaurantStaffActiveModel,
) -> Result<(), String> {
    let result = RestaurantStaffs::insert(new_staff).exec(&state.conn).await;

    match result {
        Ok(_) => Ok(()),
        Err(err) => {
            eprintln!("Failed to insert restaurant staff: {:?}", err);
            Err(format!("Failed to insert restaurant staff: {:?}", err))
        }
    }
}

pub async fn get_all_restaurant_staff(
    state: &State<'_, AppState>,
) -> Result<Vec<RestaurantStaffModel>, String> {
    let result = RestaurantStaffs::find().all(&state.conn).await;

    match result {
        Ok(staff) => Ok(staff),
        Err(err) => {
            eprintln!("Failed to get all restaurant staff: {:?}", err);
            Err(format!("Failed to get all restaurant staff: {:?}", err))
        }
    }
}

pub async fn get_restaurant_staff(
    state: &State<'_, AppState>,
    id: &str,
) -> Result<RestaurantStaffModel, String> {
    let result = RestaurantStaffs::find()
        .filter(RestaurantStaffColumn::Id.eq(id.to_owned()))
        .one(&state.conn)
        .await;

    match result {
        Ok(Some(staff)) => Ok(staff),
        Ok(None) => Err(format!("Restaurant staff with ID {} not found", id)),
        Err(err) => {
            eprintln!("Failed to get restaurant staff: {:?}", err);
            Err(format!("Failed to get restaurant staff: {:?}", err))
        }
    }
}

pub async fn get_staff_by_restaurant(
    state: &State<'_, AppState>,
    restaurant_id: &str,
) -> Result<Vec<RestaurantStaffModel>, String> {
    let result = RestaurantStaffs::find()
        .filter(RestaurantStaffColumn::RestaurantId.eq(restaurant_id.to_owned()))
        .all(&state.conn)
        .await;

    match result {
        Ok(staff) => Ok(staff),
        Err(err) => {
            eprintln!(
                "Failed to get staff for restaurant {}: {:?}",
                restaurant_id, err
            );
            Err(format!(
                "Failed to get staff for restaurant {}: {:?}",
                restaurant_id, err
            ))
        }
    }
}

pub async fn delete_restaurant_staff(
    state: &State<'_, AppState>,
    restaurant_id: &str,
    staff_id: &str,
) -> Result<(), String> {
    let result = RestaurantStaffs::delete_many()
        .filter(RestaurantStaffColumn::RestaurantId.eq(restaurant_id.to_owned()))
        .filter(RestaurantStaffColumn::StaffId.eq(staff_id.to_owned()))
        .exec(&state.conn)
        .await;

    match result {
        Ok(_) => Ok(()),
        Err(err) => {
            eprintln!("Failed to delete restaurant staff: {:?}", err);
            Err(format!("Failed to delete restaurant staff: {:?}", err))
        }
    }
}

pub async fn get_staff_assigned_restaurant(
    state: &State<'_, AppState>,
    staff_id: &str,
) -> Result<RestaurantModel, String> {
    let staff_result = RestaurantStaffs::find()
        .filter(RestaurantStaffColumn::StaffId.eq(staff_id.to_owned()))
        .one(&state.conn)
        .await;

    match staff_result {
        Ok(Some(staff)) => {
            restaurant_repository::get_restaurant_by_id(state, &staff.restaurant_id).await
        }
        Ok(None) => Err(format!(
            "No restaurant assignment found for staff with ID {}",
            staff_id
        )),
        Err(err) => {
            eprintln!("Failed to get staff assignment: {:?}", err);
            Err(format!("Failed to get staff assignment: {:?}", err))
        }
    }
}
