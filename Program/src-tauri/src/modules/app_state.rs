use entities::user::Model as UserModel;
use futures::lock::Mutex;
use sea_orm::DatabaseConnection;

pub struct AppState {
    pub conn: DatabaseConnection,
    pub current_user: Mutex<Option<UserModel>>,
}
