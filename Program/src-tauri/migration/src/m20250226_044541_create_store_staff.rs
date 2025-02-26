use sea_orm_migration::{prelude::*, schema::*};

use crate::{m20250225_065835_create_staff::Staff, m20250226_042701_create_store::Store};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(StoreStaff::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(StoreStaff::Id)
                            .string()
                            .not_null()
                            .primary_key(),
                    )
                    .col(string(StoreStaff::StoreId).not_null())
                    .col(string(StoreStaff::StaffId).not_null())
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_store_staff_store")
                            .from(StoreStaff::Table, StoreStaff::StoreId)
                            .to(Store::Table, Store::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_store_staff_staff")
                            .from(StoreStaff::Table, StoreStaff::StoreId)
                            .to(Store::Table, Staff::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(StoreStaff::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum StoreStaff {
    Table,
    Id,
    StoreId,
    StaffId,
}
