use sea_orm::ActiveValue;

use crate::models::store_deletion_proposal::ActiveModel as DeleteStoreProposalActiveModel;

use super::id_factory;

pub fn create_delete_store_proposal(
    store_id: String,
    reason: String,
) -> DeleteStoreProposalActiveModel {
    let proposal_id = id_factory::generate_customer_id();

    DeleteStoreProposalActiveModel {
        id: ActiveValue::Set(proposal_id.to_string()),
        store_id: ActiveValue::Set(store_id),
        reason: ActiveValue::Set(reason),
        approved: ActiveValue::Set(0),
        done: ActiveValue::Set(0),
    }
}
