use sea_orm_migration::{prelude::*, schema::*};

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
}
