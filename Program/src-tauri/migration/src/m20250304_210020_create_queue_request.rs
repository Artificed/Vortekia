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
                    .table(QueueRequest::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(QueueRequest::Id)
                            .string()
                            .not_null()
                            .primary_key(),
                    )
                    .col(string(QueueRequest::RideId).not_null())
                    .col(string(QueueRequest::CustomerId).not_null())
                    .col(string(QueueRequest::RequestTime).date_time().not_null())
                    .col(boolean(QueueRequest::Approved).not_null())
                    .col(boolean(QueueRequest::Done).not_null())
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_queue_request_ride_id")
                            .from(QueueRequest::Table, QueueRequest::RideId)
                            .to(Ride::Table, Ride::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_queue_request_customer_id")
                            .from(QueueRequest::Table, QueueRequest::CustomerId)
                            .to(Customer::Table, Customer::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(QueueRequest::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum QueueRequest {
    Table,
    Id,
    RideId,
    CustomerId,
    RequestTime,
    Approved,
    Done,
}
