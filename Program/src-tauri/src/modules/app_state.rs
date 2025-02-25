use entities::user::Model as UserModel;
use futures::lock::Mutex;
use sea_orm::DatabaseConnection;

use super::app_config::AppConfig;

pub struct AppState {
    pub config: AppConfig,
    pub conn: DatabaseConnection,
    pub current_user: Mutex<Option<UserModel>>,
}
