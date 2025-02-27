use crate::models::lost_and_found_log::ActiveModel as LnfLogActiveModel;
use sea_orm::ActiveValue;

use super::id_factory;

pub fn create_lnf_log(
    image: &str,
    name: &str,
    r#type: &str,
    color: &str,
    last_seen_location: &str,
    finder: &str,
    owner: &str,
    status: &str,
) -> LnfLogActiveModel {
    let id = id_factory::generate_customer_id();

    LnfLogActiveModel {
        id: ActiveValue::Set(id.to_string()),
        image: ActiveValue::Set(image.to_string()),
        name: ActiveValue::Set(name.to_string()),
        r#type: ActiveValue::Set(r#type.to_string()),
        color: ActiveValue::Set(color.to_string()),
        last_seen_location: ActiveValue::Set(last_seen_location.to_string()),
        finder: ActiveValue::Set(finder.to_string()),
        owner: ActiveValue::Set(owner.to_string()),
        status: ActiveValue::Set(status.to_string()),
    }
}
