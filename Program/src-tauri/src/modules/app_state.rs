use futures::lock::Mutex;
use sea_orm::DatabaseConnection;

use super::{app_config::AppConfig, user_type::UserType};
use redis::Client as RedisClient;

pub struct AppState {
    pub config: AppConfig,
    pub conn: DatabaseConnection,
    pub redis: RedisClient,
    pub current_user: Mutex<Option<UserType>>,
}
