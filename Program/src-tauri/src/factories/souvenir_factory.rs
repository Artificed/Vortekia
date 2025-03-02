use sea_orm::ActiveValue;

use super::id_factory;
use crate::models::souvenir::ActiveModel as SouvenirActiveModel;

pub fn create_souvenir(
    store_id: String,
    name: String,
    price: i32,
    description: String,
    image: String,
) -> SouvenirActiveModel {
    let id = id_factory::generate_customer_id();

    SouvenirActiveModel {
        id: ActiveValue::Set(id.to_string()),
        store_id: ActiveValue::Set(store_id),
        name: ActiveValue::Set(name),
        price: ActiveValue::Set(price),
        description: ActiveValue::Set(description),
        image: ActiveValue::Set(image),
    }
}
