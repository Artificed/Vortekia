use crate::factories::maintenance_report_factory;
use crate::models::maintenance_report::Model as MaintenanceReportModel;
use crate::modules::app_state::AppState;
use crate::repositories::maintenance_report_repository;
use tauri::State;

pub async fn insert_new_maintenance_report(
    state: &State<'_, AppState>,
    id: String,
    title: String,
    content: String,
) -> Result<(), String> {
    let report = maintenance_report_factory::create_maintenance_report(id, title, content);
    maintenance_report_repository::insert_maintenance_report(state, report).await
}

pub async fn get_all_maintenance_reports(
    state: &State<'_, AppState>,
) -> Result<Vec<MaintenanceReportModel>, String> {
    maintenance_report_repository::get_all_maintenance_reports(state).await
}

pub async fn get_maintenance_report_by_id(
    state: &State<'_, AppState>,
    id: String,
) -> Result<MaintenanceReportModel, String> {
    maintenance_report_repository::get_maintenance_report_by_id(state, &id).await
}

// pub async fn update_maintenance_report(
//     state: &State<'_, AppState>,
//     report: MaintenanceReportModel,
//     title: String,
//     content: String,
// ) -> Result<(), String> {
//     maintenance_report_repository::update_maintenance_report(state, report.into(), title, content)
//         .await
// }

pub async fn delete_maintenance_report(
    state: &State<'_, AppState>,
    id: String,
) -> Result<(), String> {
    maintenance_report_repository::delete_maintenance_report(state, &id).await
}
