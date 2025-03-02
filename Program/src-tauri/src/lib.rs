use dotenv::dotenv;
use futures::lock::Mutex;
use modules::{app_config::AppConfig, app_state::AppState};
use sea_orm::{Database, DatabaseConnection};
use std::{env, fs};

pub mod factories;
pub mod handlers;
pub mod models;
pub mod modules;
pub mod repositories;
pub mod services;
pub mod viewmodels;

pub use services::*;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub async fn run() {
    dotenv().ok();
    let app_id = env::var("APP_ID").expect("App Id must be set!");
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");

    let config_path = String::from("config.json");
    let config_content = fs::read_to_string(&config_path)
        .map_err(|e| format!("Failed to read config file {}: {}", config_path, e));

    let conn: DatabaseConnection = Database::connect(&database_url)
        .await
        .expect("Failed to connect to database!");

    let configs: Vec<AppConfig> = match config_content {
        Ok(content) => match serde_json::from_str(&content) {
            Ok(configs) => configs,
            Err(err) => {
                eprintln!("Error parsing config: {}", err);
                std::process::exit(1);
            }
        },
        Err(err) => {
            eprintln!("Failed to read config file: {}", err);
            std::process::exit(1);
        }
    };

    let config_result = configs
        .into_iter()
        .find(|cfg| cfg.app_id == app_id)
        .ok_or_else(|| format!("No config found for app_id: {}", app_id));

    let config = match config_result {
        Ok(config) => config,
        Err(err) => {
            eprintln!("{}", err);
            std::process::exit(1);
        }
    };

    let state = AppState {
        conn,
        current_user: Mutex::new(None),
        config,
    };

    tauri::Builder::default()
        .manage(state)
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            context_service::get_current_ui,
            customer_service::login_customer,
            customer_service::register_customer,
            customer_service::get_all_customers,
            customer_service::add_current_user_balance,
            staff_service::register_staff,
            staff_service::login_staff,
            staff_service::get_lnf_staffs,
            staff_service::get_ride_staffs,
            auth_service::logout_user,
            auth_service::get_current_user,
            lnf_log_service::get_lnf_logs,
            lnf_log_service::insert_lnf_log,
            lnf_log_service::update_lnf_log,
            new_ride_proposal_service::insert_new_ride_proposal,
            new_ride_proposal_service::get_new_ride_proposals,
            new_ride_proposal_service::update_new_ride_proposal_approval,
            ride_service::get_all_rides,
            ride_service::update_ride,
            ride_deletion_proposal_service::insert_ride_deletion_proposal,
            ride_deletion_proposal_service::get_all_ride_deletion_proposals,
            ride_deletion_proposal_service::update_ride_deletion_proposal_approval,
            staff_schedule_service::get_all_ride_staff_schedules,
            ride_service::get_rides_with_staff,
            restaurant_proposal_service::insert_new_restaurant_proposal,
            restaurant_proposal_service::get_all_new_restaurant_proposals,
            restaurant_proposal_service::update_new_restaurant_proposal_cfo_approval
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
