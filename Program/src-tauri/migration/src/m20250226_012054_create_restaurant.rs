use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Restaurant::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(Restaurant::Id)
                            .string()
                            .not_null()
                            .primary_key(),
                    )
                    .col(string(Restaurant::Name).not_null())
                    .col(string(Restaurant::Image).not_null())
                    .col(string(Restaurant::OpeningTime).timestamp().not_null())
                    .col(string(Restaurant::ClosingTime).timestamp().not_null())
                    .col(string(Restaurant::CuisineType).not_null())
                    .col(boolean(Restaurant::IsOpen).not_null())
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Restaurant::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
pub enum Restaurant {
    Table,
    Id,
    Name,
    Image,
    OpeningTime,
    ClosingTime,
    CuisineType,
    IsOpen,
}
