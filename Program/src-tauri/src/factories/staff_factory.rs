use crate::models::staff::ActiveModel as StaffActiveModel;
use argon2::{Argon2, PasswordHasher};
use password_hash::{rand_core::OsRng, SaltString};
use sea_orm::ActiveValue;

use super::id_factory;

pub fn create_staff(username: &str, password: &str, role: &str) -> StaffActiveModel {
    let staff_id = id_factory::generate_staff_id();
    let argon2 = Argon2::default();

    let salt = SaltString::generate(&mut OsRng);

    let hashed_password = argon2
        .hash_password(password.as_bytes(), &salt)
        .unwrap()
        .to_string();

    StaffActiveModel {
        id: ActiveValue::Set(staff_id),
        username: ActiveValue::Set(username.to_string()),
        password: ActiveValue::Set(hashed_password),
        role: ActiveValue::Set(role.to_string()),
    }
}
