use sea_orm::ActiveValue;

use crate::models::new_ride_proposal::ActiveModel as NewRideProposalActiveModel;

use super::id_factory;

pub fn create_ride_proposal(
    ride_name: String,
    cost_review: String,
    image: String,
) -> NewRideProposalActiveModel {
    let ride_id = id_factory::generate_customer_id();

    NewRideProposalActiveModel {
        id: ActiveValue::Set(ride_id.to_string()),
        ride_name: ActiveValue::Set(ride_name),
        cost_review: ActiveValue::Set(cost_review),
        image: ActiveValue::Set(image),
        approved: ActiveValue::Set(0),
        done: ActiveValue::Set(0),
    }
}
