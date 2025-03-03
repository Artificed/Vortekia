use sea_orm_migration::{prelude::*, schema::*};

use crate::{
    m20250225_065344_create_customers::Customer, m20250226_043305_create_souvenir::Souvenir,
};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(StoreTransaction::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(StoreTransaction::Id)
                            .string()
                            .not_null()
                            .primary_key(),
                    )
                    .col(string(StoreTransaction::SouvenirId).not_null())
                    .col(string(StoreTransaction::CustomerId).not_null())
                    .col(string(StoreTransaction::Quantity).integer().not_null())
                    .col(string(StoreTransaction::Price).integer().not_null())
                    .col(
                        string(StoreTransaction::TransactionDate)
                            .date_time()
                            .not_null(),
                    )
                    .col(string(StoreTransaction::Status).not_null())
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_create_store_transaction_souvenir_id")
                            .from(StoreTransaction::Table, StoreTransaction::SouvenirId)
                            .to(Souvenir::Table, Souvenir::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_create_store_transaction_customer_id")
                            .from(StoreTransaction::Table, StoreTransaction::CustomerId)
                            .to(Customer::Table, Customer::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(StoreTransaction::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum StoreTransaction {
    Table,
    Id,
    SouvenirId,
    CustomerId,
    Quantity,
    Price,
    TransactionDate,
    Status,
}
