use entities::user::ActiveModel as UserActiveModel;
use sea_orm::ActiveValue;

pub fn create_user(username: &str, password: &str, role: &str) -> UserActiveModel {
    UserActiveModel {
        id: ActiveValue::NotSet,
        username: ActiveValue::Set(username.to_string()),
        password: ActiveValue::Set(password.to_string()),
        role: ActiveValue::Set(role.to_string()),
    }
}
