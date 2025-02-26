use tauri::State;

use crate::{handlers::customer_handler, modules::app_state::AppState};

#[tauri::command]
pub async fn register_customer(
    state: State<'_, AppState>,
    username: String,
    balance: i32,
) -> Result<String, String> {
    customer_handler::register_customer(state, username, balance).await
}

#[tauri::command]
pub async fn login_customer(state: State<'_, AppState>, id: &str) -> Result<(), String> {
    customer_handler::login_customer(state, id).await
}

// #[tauri::command]
// pub async fn logout_user(state: State<'_, AppState>) -> Result<(), String> {
//     let mut current_user = state.current_user.lock().await;
//     *current_user = None;
//     Ok(())
// }
//
// #[tauri::command]
// pub async fn get_current_user(state: State<'_, AppState>) -> Result<UserModel, String> {
//     let current_user = user_repository::get_current_user(state).await;
//     match current_user {
//         Some(user) => Ok(user),
//         None => Err(String::from("User not logged in!")),
//     }
// }
