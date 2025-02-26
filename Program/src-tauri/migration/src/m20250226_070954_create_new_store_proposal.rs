use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(NewStoreProposal::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(NewStoreProposal::Id)
                            .string()
                            .not_null()
                            .primary_key(),
                    )
                    .col(string(NewStoreProposal::StoreName).not_null())
                    .col(string(NewStoreProposal::StoreImage).not_null())
                    .col(string(NewStoreProposal::StoreDescription).not_null())
                    .col(string(NewStoreProposal::Reason).not_null())
                    .col(boolean(NewStoreProposal::Approved).not_null())
                    .col(boolean(NewStoreProposal::Done).not_null())
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(NewStoreProposal::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
pub enum NewStoreProposal {
    Table,
    Id,
    StoreName,
    StoreImage,
    StoreDescription,
    Reason,
    Approved,
    Done,
}
