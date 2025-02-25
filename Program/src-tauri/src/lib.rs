use dotenv::dotenv;
use futures::lock::Mutex;
use modules::app_state::AppState;
use sea_orm::{Database, DatabaseConnection};
use std::env;

pub mod factories;
pub mod modules;
pub mod repositories;
pub mod services;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub async fn run() {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");

    let conn: DatabaseConnection = Database::connect(&database_url)
        .await
        .expect("Failed to connect to database!");

    let state = AppState {
        conn,
        current_user: Mutex::new(None),
    };

    tauri::Builder::default()
        .manage(state)
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
