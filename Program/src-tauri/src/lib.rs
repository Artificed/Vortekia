use dotenv::dotenv;
use modules::{app_config::AppConfig, app_state::AppState};
use sea_orm::{Database, DatabaseConnection};
use std::{env, fs};

pub mod factories;
pub mod models;
pub mod modules;
pub mod repositories;
pub mod services;

pub use services::context_service;

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
        // current_user: Mutex::new(None),
        config,
    };

    tauri::Builder::default()
        .manage(state)
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![context_service::get_current_ui])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
