use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(NewRideProposal::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(NewRideProposal::Id)
                            .string()
                            .not_null()
                            .primary_key(),
                    )
                    .col(string(NewRideProposal::RideName).not_null())
                    .col(string(NewRideProposal::CostReview).not_null())
                    .col(string(NewRideProposal::Image).not_null())
                    .col(boolean(NewRideProposal::Approved).not_null().default(false))
                    .col(boolean(NewRideProposal::Done).not_null().default(false))
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(NewRideProposal::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum NewRideProposal {
    Table,
    Id,
    RideName,
    CostReview,
    Image,
    Approved,
    Done,
}
