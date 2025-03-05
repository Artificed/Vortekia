use sea_orm_migration::{prelude::*, schema::*};

use crate::m20250305_051953_create_maintenance_task::MaintenanceTask;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(MaintenanceLog::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(MaintenanceLog::Id)
                            .string()
                            .not_null()
                            .primary_key(),
                    )
                    .col(string(MaintenanceLog::TaskId).not_null())
                    .col(string(MaintenanceLog::Message).not_null())
                    .col(string(MaintenanceLog::CreatedAt).date_time().not_null())
                    .col(boolean(MaintenanceLog::Approved).not_null())
                    .col(boolean(MaintenanceLog::Done).not_null())
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_create_maintenance_log_task_id")
                            .from(MaintenanceLog::Table, MaintenanceLog::TaskId)
                            .to(MaintenanceTask::Table, MaintenanceTask::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(MaintenanceLog::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum MaintenanceLog {
    Table,
    Id,
    TaskId,
    Message,
    CreatedAt,
    Approved,
    Done,
}
