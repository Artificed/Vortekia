use sea_orm::ActiveValue;

use crate::models::ride_deletion_proposal::ActiveModel as RideDeletionProposalActiveModel;

use super::id_factory;

pub fn create_ride_proposal(ride_id: String, reason: String) -> RideDeletionProposalActiveModel {
    let id = id_factory::generate_customer_id();

    RideDeletionProposalActiveModel {
        id: ActiveValue::Set(id.to_string()),
        ride_id: ActiveValue::Set(ride_id.to_string()),
        reason: ActiveValue::Set(reason.to_string()),
        approved: ActiveValue::Set(0),
        done: ActiveValue::Set(0),
    }
}
