// use tauri::State;
//
// use crate::{factories::user_factory, modules::app_state::AppState, repositories::user_repository};
// use entities::user::Model as UserModel;
//
// #[tauri::command]
// pub async fn register_user(
//     state: State<'_, AppState>,
//     username: String,
//     password: String,
//     role: String,
// ) -> Result<(), String> {
//     let new_user = user_factory::create_user(&username, &password, &role);
//     user_repository::insert_user(state, new_user).await
// }
//
// #[tauri::command]
// pub async fn login_user(
//     state: State<'_, AppState>,
//     username: String,
//     password: String,
// ) -> Result<(), String> {
//     let user = user_repository::get_user_from_username(&state, &username).await?;
//     if let Some(user) = user {
//         if user.password == password {
//             let mut current_user = state.current_user.lock().await;
//             *current_user = Some(user);
//             Ok(())
//         } else {
//             Err("Invalid password!".to_string())
//         }
//     } else {
//         Err("User not found!".to_string())
//     }
// }
//
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
