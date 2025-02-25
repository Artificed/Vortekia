use crate::models::customer::ActiveModel as CustomerActiveModel;

use sea_orm::ActiveValue;

pub fn create_user(username: &str) -> CustomerActiveModel {
    CustomerActiveModel {
        id: ActiveValue::NotSet,
        name: ActiveValue::Set(username.to_string()),
        balance: ActiveValue::Set(0),
    }
}
