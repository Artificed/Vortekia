use crate::models::staff::ActiveModel as StaffActiveModel;

use sea_orm::ActiveValue;

use super::id_factory;

pub fn create_staff(username: &str, role: &str) -> StaffActiveModel {
    let staff_id = id_factory::generate_staff_id();

    StaffActiveModel {
        id: ActiveValue::Set(staff_id),
        username: ActiveValue::Set(username.to_string()),
        password: ActiveValue::Set("password".to_string()),
        role: ActiveValue::Set(role.to_string()),
    }
}
