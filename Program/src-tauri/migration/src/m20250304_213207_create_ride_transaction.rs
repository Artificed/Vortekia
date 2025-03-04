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
                    .table(RideTransaction::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(RideTransaction::Id)
                            .string()
                            .not_null()
                            .primary_key(),
                    )
                    .col(string(RideTransaction::CustomerId).not_null())
                    .col(string(RideTransaction::RideId).not_null())
                    .col(string(RideTransaction::RidePrice).integer().not_null())
                    .col(
                        string(RideTransaction::TransactionDate)
                            .date_time()
                            .not_null(),
                    )
                    .col(string(RideTransaction::Status).not_null())
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_create_ride_transaction_customer_id")
                            .from(RideTransaction::Table, RideTransaction::CustomerId)
                            .to(Customer::Table, Customer::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_create_ride_transaction_ride_id")
                            .from(RideTransaction::Table, RideTransaction::RideId)
                            .to(Ride::Table, Ride::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(RideTransaction::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum RideTransaction {
    Table,
    Id,
    RideId,
    RidePrice,
    CustomerId,
    TransactionDate,
    Status,
}
