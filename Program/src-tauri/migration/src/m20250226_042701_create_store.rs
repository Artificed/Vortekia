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
                    .table(Store::Table)
                    .if_not_exists()
                    .col(ColumnDef::new(Store::Id).string().not_null().primary_key())
                    .col(string(Store::Name).not_null())
                    .col(string(Store::Image).not_null())
                    .col(string(Store::Description).not_null())
                    .col(string(Store::OpeningTime).time().not_null())
                    .col(string(Store::ClosingTime).time().not_null())
                    .col(string(Store::SalesAssociate).null())
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_store_sales_associate_staff_id")
                            .from(Store::Table, Store::SalesAssociate)
                            .to(Staff::Table, Staff::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Store::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
pub enum Store {
    Table,
    Id,
    Name,
    Image,
    Description,
    OpeningTime,
    ClosingTime,
    SalesAssociate,
}
