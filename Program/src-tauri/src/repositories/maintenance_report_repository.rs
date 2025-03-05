use sea_orm::{ActiveModelTrait, ActiveValue, ColumnTrait, EntityTrait, QueryFilter};
use tauri::State;

use crate::models::maintenance_report::{
    ActiveModel as MaintenanceReportActiveModel, Column as MaintenanceReportColumn,
    Entity as MaintenanceReports, Model as MaintenanceReportModel,
};
use crate::modules::app_state::AppState;

pub async fn insert_maintenance_report(
    state: &State<'_, AppState>,
    report: MaintenanceReportActiveModel,
) -> Result<(), String> {
    let result = MaintenanceReports::insert(report).exec(&state.conn).await;
    match result {
        Ok(_) => Ok(()),
        Err(err) => {
            eprintln!("Failed to insert maintenance report: {:?}", err);
            Err(format!("Failed to insert maintenance report: {:?}", err))
        }
    }
}

pub async fn get_all_maintenance_reports(
    state: &State<'_, AppState>,
) -> Result<Vec<MaintenanceReportModel>, String> {
    let result = MaintenanceReports::find().all(&state.conn).await;
    match result {
        Ok(reports) => Ok(reports),
        Err(err) => {
            eprintln!("Failed to get all maintenance reports: {:?}", err);
            Err(format!("Failed to get all maintenance reports: {:?}", err))
        }
    }
}

pub async fn get_maintenance_report_by_id(
    state: &State<'_, AppState>,
    id: &str,
) -> Result<MaintenanceReportModel, String> {
    let result = MaintenanceReports::find()
        .filter(MaintenanceReportColumn::Id.eq(id.to_owned()))
        .one(&state.conn)
        .await;
    match result {
        Ok(Some(report)) => Ok(report),
        Ok(None) => Err(format!("Maintenance report with ID {} not found", id)),
        Err(err) => {
            eprintln!("Failed to get maintenance report: {:?}", err);
            Err(format!("Failed to get maintenance report: {:?}", err))
        }
    }
}

pub async fn update_maintenance_report(
    state: &State<'_, AppState>,
    mut report: MaintenanceReportActiveModel,
    title: String,
    content: String,
) -> Result<(), String> {
    report.title = ActiveValue::Set(title);
    report.content = ActiveValue::Set(content);
    let result = report.update(&state.conn).await;
    match result {
        Ok(_) => Ok(()),
        Err(err) => {
            eprintln!("Failed to update maintenance report: {:?}", err);
            Err(format!("Failed to update maintenance report: {:?}", err))
        }
    }
}

pub async fn delete_maintenance_report(
    state: &State<'_, AppState>,
    id: &str,
) -> Result<(), String> {
    let result = MaintenanceReports::delete_by_id(id.to_owned())
        .exec(&state.conn)
        .await;
    match result {
        Ok(delete_result) if delete_result.rows_affected > 0 => Ok(()),
        Ok(_) => Err(format!("Maintenance report with ID {} not found", id)),
        Err(err) => {
            eprintln!("Failed to delete maintenance report: {:?}", err);
            Err(format!("Failed to delete maintenance report: {:?}", err))
        }
    }
}
