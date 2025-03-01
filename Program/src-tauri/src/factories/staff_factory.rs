use crate::models::staff::ActiveModel as StaffActiveModel;
use argon2::{Argon2, PasswordHasher};
use chrono::NaiveTime;
use password_hash::{rand_core::OsRng, SaltString};
use sea_orm::ActiveValue;

use super::id_factory;

pub fn create_staff(
    username: &str,
    password: &str,
    role: &str,
    shift_start: &str,
    shift_end: &str,
) -> StaffActiveModel {
    let staff_id = id_factory::generate_staff_id();
    let argon2 = Argon2::default();

    let salt = SaltString::generate(&mut OsRng);

    let hashed_password = argon2
        .hash_password(password.as_bytes(), &salt)
        .unwrap()
        .to_string();

    let shift_start_time = NaiveTime::parse_from_str(shift_start, "%H:%M:%S")
        .expect("Invalid shift_start time format");
    let shift_end_time =
        NaiveTime::parse_from_str(shift_end, "%H:%M:%S").expect("Invalid shift_end time format");

    StaffActiveModel {
        id: ActiveValue::Set(staff_id),
        username: ActiveValue::Set(username.to_string()),
        password: ActiveValue::Set(hashed_password),
        role: ActiveValue::Set(role.to_string()),
        shift_start: ActiveValue::Set(shift_start_time),
        shift_end: ActiveValue::Set(shift_end_time),
    }
}
