use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Ride::Table)
                    .if_not_exists()
                    .col(ColumnDef::new(Ride::Id).string().not_null().primary_key())
                    .col(string(Ride::Name).not_null())
                    .col(string(Ride::Image).not_null())
                    .col(string(Ride::Price).integer().not_null())
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Ride::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
pub enum Ride {
    Table,
    Id,
    Name,
    Image,
    Price,
}
