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
                    .table(StoreDeletionProposal::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(StoreDeletionProposal::Id)
                            .string()
                            .not_null()
                            .primary_key(),
                    )
                    .col(string(StoreDeletionProposal::StoreId).not_null())
                    .col(string(StoreDeletionProposal::Reason).not_null())
                    .col(boolean(StoreDeletionProposal::Approved).not_null())
                    .col(boolean(StoreDeletionProposal::Done).not_null())
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_create_store_deletion_proposal_store_id")
                            .from(StoreDeletionProposal::Table, StoreDeletionProposal::StoreId)
                            .to(Store::Table, Store::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(StoreDeletionProposal::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum StoreDeletionProposal {
    Table,
    Id,
    StoreId,
    Reason,
    Approved,
    Done,
}
