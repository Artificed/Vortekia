use sea_orm::ActiveValue;

use crate::models::new_store_proposal::ActiveModel as NewStoreProposalActiveModel;

use super::id_factory;

pub fn create_store_proposal(
    store_name: String,
    store_image: String,
    store_description: String,
    reason: String,
) -> NewStoreProposalActiveModel {
    let id = id_factory::generate_customer_id();

    NewStoreProposalActiveModel {
        id: ActiveValue::Set(id.to_string()),
        store_name: ActiveValue::Set(store_name.to_string()),
        store_image: ActiveValue::Set(store_image.to_string()),
        store_description: ActiveValue::Set(store_description.to_string()),
        reason: ActiveValue::Set(reason.to_string()),
        approved: ActiveValue::Set(0),
        done: ActiveValue::Set(0),
    }
}
