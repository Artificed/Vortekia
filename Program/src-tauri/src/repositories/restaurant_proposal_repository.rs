use sea_orm::ActiveModelTrait;
use sea_orm::ActiveValue;
use tauri::State;

use crate::handlers::restaurant_handler;
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

pub async fn update_new_restaurant_proposal(
    state: &State<'_, AppState>,
    id: &str,
    cfo_approve: i8,
    cfo_done: i8,
    ceo_approve: i8,
    ceo_done: i8,
) -> Result<(), String> {
    let proposal = RestaurantProposals::find()
        .filter(RestaurantProposalColumn::Id.eq(id))
        .one(&state.conn)
        .await
        .map_err(|err| format!("Failed to find restaurant proposal: {:?}", err))?
        .ok_or_else(|| format!("Restaurant proposal with ID {} not found", id))?;

    let name = proposal.name.clone();
    let image = proposal.image.clone();
    let cuisine_type = proposal.cuisine_type.clone();
    let opening_time_str = proposal.opening_time.to_string();
    let closing_time_str = proposal.closing_time.to_string();

    let mut proposal_active: RestaurantProposalActiveModel = proposal.into();

    proposal_active.cfo_approved = ActiveValue::Set(cfo_approve);
    proposal_active.cfo_done = ActiveValue::Set(cfo_done);
    proposal_active.ceo_approved = ActiveValue::Set(ceo_approve);
    proposal_active.ceo_done = ActiveValue::Set(ceo_done);

    proposal_active.update(&state.conn).await.map_err(|err| {
        format!(
            "Failed to update restaurant proposal approval status: {:?}",
            err
        )
    })?;

    if cfo_approve == 1 && cfo_done == 1 && ceo_approve == 1 && ceo_done == 1 {
        restaurant_handler::insert_new_restaurant(
            state,
            name,
            opening_time_str,
            closing_time_str,
            cuisine_type,
            image,
        )
        .await
    } else {
        Ok(())
    }
}

pub async fn get_cfo_approved_restaurant_proposals(
    state: &State<'_, AppState>,
) -> Result<Vec<RestaurantProposalModel>, String> {
    let result = RestaurantProposals::find()
        .filter(RestaurantProposalColumn::CfoApproved.eq(1))
        .filter(RestaurantProposalColumn::CfoDone.eq(1))
        .all(&state.conn)
        .await;

    match result {
        Ok(proposals) => Ok(proposals),
        Err(err) => {
            eprintln!("Failed to get CFO approved restaurant proposals: {:?}", err);
            Err(format!(
                "Failed to get CFO approved restaurant proposals: {:?}",
                err
            ))
        }
    }
}
