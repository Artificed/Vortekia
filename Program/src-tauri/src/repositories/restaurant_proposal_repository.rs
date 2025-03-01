use sea_orm::ActiveModelTrait;
use tauri::State;

use crate::models::new_restaurant_proposal::ActiveModel as RestaurantProposalActiveModel;
use crate::models::new_restaurant_proposal::Column as RestaurantProposalColumn;
use crate::models::new_restaurant_proposal::Entity as RestaurantProposals;
use crate::models::new_restaurant_proposal::Model as RestaurantProposalModel;
use crate::modules::app_state::AppState;
use sea_orm::{ColumnTrait, EntityTrait, QueryFilter};

pub async fn insert_new_restaurant_proposal(
    state: &State<'_, AppState>,
    new_restaurant_proposal: RestaurantProposalActiveModel,
) -> Result<(), String> {
    let result = RestaurantProposals::insert(new_restaurant_proposal)
        .exec(&state.conn)
        .await;

    match result {
        Ok(_) => Ok(()),
        Err(err) => {
            eprintln!("Failed to insert new restaurant proposal: {:?}", err);
            Err(format!(
                "Failed to insert new restaurant proposal: {:?}",
                err
            ))
        }
    }
}

pub async fn get_all_new_restaurant_proposals(
    state: &State<'_, AppState>,
) -> Result<Vec<RestaurantProposalModel>, String> {
    let result = RestaurantProposals::find().all(&state.conn).await;

    match result {
        Ok(proposals) => Ok(proposals),
        Err(err) => {
            eprintln!("Failed to get all new restaurant proposals: {:?}", err);
            Err(format!(
                "Failed to get all new restaurant proposals: {:?}",
                err
            ))
        }
    }
}

pub async fn get_restaurant_proposal(
    state: &State<'_, AppState>,
    id: &str,
) -> Result<RestaurantProposalModel, String> {
    let result = RestaurantProposals::find()
        .filter(RestaurantProposalColumn::Id.eq(id.to_owned()))
        .one(&state.conn)
        .await;

    match result {
        Ok(Some(proposal)) => Ok(proposal),
        Ok(None) => Err(format!("Restaurant proposal with ID {} not found", id)),
        Err(err) => {
            eprintln!("Failed to get restaurant proposal: {:?}", err);
            Err(format!("Failed to get restaurant proposal: {:?}", err))
        }
    }
}

// pub async fn update_new_restaurant_proposal_cfo_approval(
//     state: &State<'_, AppState>,
//     id: &str,
//     approve: i8,
// ) -> Result<(), String> {
//     let proposal = RestaurantProposals::find()
//         .filter(RestaurantProposalColumn::Id.eq(id))
//         .one(&state.conn)
//         .await;
//
//     match proposal {
//         Ok(Some(proposal)) => {
//             let mut proposal_active: RestaurantProposalActiveModel = proposal.into();
//
//             proposal_active.cfo_approved = Set(approve);
//             proposal_active.cfo_done = Set(1);
//
//             let result = proposal_active.update(&state.conn).await;
//
//             match result {
//                 Ok(_) => Ok(()),
//                 Err(err) => {
//                     eprintln!(
//                         "Failed to update restaurant proposal CFO approval status: {:?}",
//                         err
//                     );
//                     Err(format!(
//                         "Failed to update restaurant proposal CFO approval status: {:?}",
//                         err
//                     ))
//                 }
//             }
//         }
//         Ok(None) => Err(format!("Restaurant proposal with ID {} not found", id)),
//         Err(err) => {
//             eprintln!("Failed to find restaurant proposal: {:?}", err);
//             Err(format!("Failed to find restaurant proposal: {:?}", err))
//         }
//     }
// }
