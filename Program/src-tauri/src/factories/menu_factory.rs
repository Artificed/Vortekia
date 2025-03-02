use sea_orm::ActiveValue;

use crate::models::menu::ActiveModel as MenuActiveModel;

use super::id_factory;

pub fn create_menu(
    restaurant_id: String,
    image: String,
    name: String,
    price: i32,
) -> MenuActiveModel {
    let menu_id = id_factory::generate_customer_id();

    MenuActiveModel {
        id: ActiveValue::Set(menu_id),
        restaurant_id: ActiveValue::Set(restaurant_id),
        image: ActiveValue::Set(image),
        name: ActiveValue::Set(name),
        price: ActiveValue::Set(price),
    }
}
