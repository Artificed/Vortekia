use super::ui_type::UiType;
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub struct AppConfig {
    pub app_id: String,
    pub ui_type: UiType,
    pub assets_path: String,
}
