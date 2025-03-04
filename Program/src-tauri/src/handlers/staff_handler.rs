use crate::{
    factories::staff_factory,
    modules::{app_state::AppState, user_type::UserType},
    repositories::staff_repository,
};

use crate::models::staff::Model as StaffModel;

use argon2::{Argon2, PasswordHash, PasswordVerifier};
use tauri::State;

pub async fn login_staff(
    state: State<'_, AppState>,
    username: &str,
    password: &str,
) -> Result<(), String> {
    let staff = staff_repository::get_staff_from_username(&state, username)
        .await
        .map_err(|_| "Failed to fetch staff!".to_string())?;

    if let Some(staff) = staff {
        let argon2 = Argon2::default();

        match PasswordHash::new(&staff.password) {
            Ok(parsed_hash) => {
                if argon2
                    .verify_password(password.as_bytes(), &parsed_hash)
                    .is_ok()
                {
                    let mut current_user = state.current_user.lock().await;
                    *current_user = Some(UserType::Staff(staff));
                    Ok(())
                } else {
                    Err("Invalid password!".to_string())
                }
            }
            Err(_) => Err("Invalid password format!".to_string()),
        }
    } else {
        Err("Staff not found!".to_string())
    }
}

pub async fn register_staff(
    state: State<'_, AppState>,
    username: &str,
    password: &str,
    role: &str,
    shift_start: &str,
    shift_end: &str,
) -> Result<(), String> {
    let staff = staff_factory::create_staff(username, password, role, shift_start, shift_end);
    staff_repository::insert_staff(&state, staff).await
}

pub async fn get_lnf_staffs(state: State<'_, AppState>) -> Result<Vec<StaffModel>, String> {
    staff_repository::get_staff_by_role(&state, "Lost and Found Staff").await
}

pub async fn get_ride_staffs(state: &State<'_, AppState>) -> Result<Vec<StaffModel>, String> {
    staff_repository::get_staff_by_role(state, "Ride Staff").await
}

pub async fn get_sales_associates(state: &State<'_, AppState>) -> Result<Vec<StaffModel>, String> {
    staff_repository::get_staff_by_role(state, "Sales Associate").await
}

pub async fn get_restaurant_staffs(state: &State<'_, AppState>) -> Result<Vec<StaffModel>, String> {
    let waiters = staff_repository::get_staff_by_role(state, "Waiter").await;
    let chefs = staff_repository::get_staff_by_role(state, "Chef").await;

    match (waiters, chefs) {
        (Ok(mut waiters), Ok(mut chefs)) => {
            waiters.append(&mut chefs);
            Ok(waiters)
        }
        (Ok(waiters), Err(e)) => {
            println!("Error retrieving chefs: {}", e);
            Ok(waiters)
        }
        (Err(e), Ok(chefs)) => {
            println!("Error retrieving waiters: {}", e);
            Ok(chefs)
        }
        (Err(e1), Err(e2)) => Err(format!(
            "Errors retrieving staff: waiters - {}, chefs - {}",
            e1, e2
        )),
    }
}
