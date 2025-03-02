use sea_orm_migration::{prelude::*, schema::*};

use crate::m20250226_042701_create_store::Store;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Souvenir::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(Souvenir::Id)
                            .string()
                            .not_null()
                            .primary_key(),
                    )
                    .col(string(Souvenir::StoreId).not_null())
                    .col(string(Souvenir::Name).not_null())
                    .col(string(Souvenir::Price).integer().not_null())
                    .col(string(Souvenir::Description).not_null())
                    .col(string(Souvenir::Image).not_null())
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_souvenir_store_id")
                            .from(Souvenir::Table, Souvenir::StoreId)
                            .to(Store::Table, Store::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Souvenir::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
pub enum Souvenir {
    Table,
    Id,
    StoreId,
    Name,
    Price,
    Description,
    Image,
}
