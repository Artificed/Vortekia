use crate::models::lost_and_found_log::ActiveModel as LnfLogActiveModel;
use sea_orm::ActiveValue;

use super::id_factory;

pub fn create_lnf_log(
    image: Option<String>,
    name: &str,
    r#type: &str,
    color: &str,
    last_seen_location: &str,
    found_location: Option<String>,
    finder: Option<String>,
    owner: &str,
    status: &str,
) -> LnfLogActiveModel {
    let id = id_factory::generate_customer_id();

    LnfLogActiveModel {
        id: ActiveValue::Set(id.to_string()),
        image: match image {
            Some(img) => ActiveValue::Set(Some(img)),
            None => ActiveValue::NotSet,
        },
        name: ActiveValue::Set(name.to_string()),
        r#type: ActiveValue::Set(r#type.to_string()),
        color: ActiveValue::Set(color.to_string()),
        last_seen_location: ActiveValue::Set(last_seen_location.to_string()),
        found_location: match found_location {
            Some(found) => ActiveValue::Set(Some(found)),
            None => ActiveValue::NotSet,
        },
        finder: match finder {
            Some(f) => ActiveValue::Set(Some(f)),
            None => ActiveValue::NotSet,
        },
        owner: ActiveValue::Set(owner.to_string()),
        status: ActiveValue::Set(status.to_string()),
    }
}
