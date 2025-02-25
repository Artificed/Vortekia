use crate::{
    modules::{app_state::AppState, user_type::UserType},
    repositories::staff_repository,
};
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
