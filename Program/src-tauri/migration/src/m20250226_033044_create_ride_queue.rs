use sea_orm_migration::{prelude::*, schema::*};

use crate::{m20250225_065344_create_customers::Customer, m20250226_010030_create_ride::Ride};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(RideQueue::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(RideQueue::Id)
                            .string()
                            .not_null()
                            .primary_key(),
                    )
                    .col(string(RideQueue::RideId).not_null())
                    .col(string(RideQueue::CustomerId).not_null())
                    .col(string(RideQueue::StartTime).date_time().not_null())
                    .col(string(RideQueue::EndTime).date_time().not_null())
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_ride_id")
                            .from(RideQueue::Table, RideQueue::RideId)
                            .to(Ride::Table, Ride::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_customer_id")
                            .from(RideQueue::Table, RideQueue::CustomerId)
                            .to(Customer::Table, Customer::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(RideQueue::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
pub enum RideQueue {
    Table,
    Id,
    RideId,
    CustomerId,
    StartTime,
    EndTime,
}
