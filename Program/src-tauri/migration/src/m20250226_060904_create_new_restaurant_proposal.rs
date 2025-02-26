use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(NewRestaurantProposal::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(NewRestaurantProposal::Id)
                            .string()
                            .not_null()
                            .primary_key(),
                    )
                    .col(string(NewRestaurantProposal::Name).not_null())
                    .col(string(NewRestaurantProposal::Image).not_null())
                    .col(
                        string(NewRestaurantProposal::OpeningTime)
                            .timestamp()
                            .not_null(),
                    )
                    .col(
                        string(NewRestaurantProposal::ClosingTime)
                            .timestamp()
                            .not_null(),
                    )
                    .col(string(NewRestaurantProposal::CuisineType).not_null())
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(NewRestaurantProposal::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum NewRestaurantProposal {
    Table,
    Id,
    Name,
    Image,
    OpeningTime,
    ClosingTime,
    CuisineType,
}
