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
                    .table(StaffSchedule::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(StaffSchedule::Id)
                            .string()
                            .not_null()
                            .primary_key(),
                    )
                    .col(string(StaffSchedule::StaffId).not_null())
                    .col(string(StaffSchedule::StartTime).time().not_null())
                    .col(string(StaffSchedule::EndTime).time().not_null())
                    .col(string(StaffSchedule::Task).not_null())
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_staff_schedule_staff_id")
                            .from(StaffSchedule::Table, StaffSchedule::StaffId)
                            .to(Staff::Table, Staff::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(StaffSchedule::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum StaffSchedule {
    Table,
    Id,
    StaffId,
    StartTime,
    EndTime,
    Task,
}
