use sea_orm_migration::{prelude::*, schema::*};

use crate::m20250225_065835_create_staff::Staff;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(MaintenanceTask::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(MaintenanceTask::Id)
                            .string()
                            .not_null()
                            .primary_key(),
                    )
                    .col(string(MaintenanceTask::Name).not_null())
                    .col(string(MaintenanceTask::Description).not_null())
                    .col(string(MaintenanceTask::AssignedStaff).not_null())
                    .col(string(MaintenanceTask::StartTime).date_time().not_null())
                    .col(string(MaintenanceTask::EndTime).date_time().not_null())
                    .col(string(MaintenanceTask::Status).not_null())
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_create_maintenance_task_staff_id")
                            .from(MaintenanceTask::Table, MaintenanceTask::AssignedStaff)
                            .to(Staff::Table, Staff::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(MaintenanceTask::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
pub enum MaintenanceTask {
    Table,
    Id,
    Name,
    Description,
    AssignedStaff,
    StartTime,
    EndTime,
    Status,
}
