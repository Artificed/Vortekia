// use sea_orm::ColumnTrait;
// use sea_orm::EntityTrait;
// use sea_orm::QueryFilter;
// use tauri::State;
//
// use crate::modules::app_state::AppState;
// use entities::user::ActiveModel as UserActiveModel;
// use entities::user::Column as UserColumn;
// use entities::user::Entity as Users;
// use entities::user::Model as UserModel;
//
// pub async fn insert_user(state: State<'_, AppState>, user: UserActiveModel) -> Result<(), String> {
//     let result = Users::insert(user).exec(&state.conn).await;
//
//     if result.is_ok() {
//         Ok(())
//     } else {
//         Err("Failed to insert user".to_string())
//     }
// }
//
// pub async fn get_current_user(state: State<'_, AppState>) -> Option<UserModel> {
//     let current_user = state.current_user.lock().await;
//     current_user.clone()
// }
//
// pub async fn get_user_from_username(
//     state: &State<'_, AppState>,
//     username: &str,
// ) -> Result<Option<UserModel>, String> {
//     let result = Users::find()
//         .filter(UserColumn::Name.contains(username))
//         .one(&state.conn)
//         .await;
//
//     match result {
//         Ok(user) => Ok(user),
//         Err(_) => Err("Failed to get user".to_string()),
//     }
// }
