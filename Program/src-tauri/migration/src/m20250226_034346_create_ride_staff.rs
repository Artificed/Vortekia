use sea_orm_migration::{prelude::*, schema::*};

use crate::{m20250225_065835_create_staff::Staff, m20250226_010030_create_ride::Ride};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(RideStaff::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(RideStaff::Id)
                            .string()
                            .not_null()
                            .primary_key(),
                    )
                    .col(string(RideStaff::RideId).not_null())
                    .col(string(RideStaff::StaffId).not_null())
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_ride_staff_ride_id")
                            .from(RideStaff::Table, RideStaff::RideId)
                            .to(Ride::Table, Ride::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_staff_id")
                            .from(RideStaff::Table, RideStaff::RideId)
                            .to(Staff::Table, Staff::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(RideStaff::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum RideStaff {
    Table,
    Id,
    RideId,
    StaffId,
}
