use sea_orm_migration::{prelude::*, schema::*};

use crate::m20250226_010030_create_ride::Ride;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(RideDeletionProposal::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(RideDeletionProposal::Id)
                            .string()
                            .not_null()
                            .primary_key(),
                    )
                    .col(string(RideDeletionProposal::RideId).not_null())
                    .col(string(RideDeletionProposal::Reason).not_null())
                    .col(boolean(RideDeletionProposal::Approved).not_null())
                    .col(boolean(RideDeletionProposal::Done).not_null())
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_create_ride_deletion_proposal_ride_id")
                            .from(RideDeletionProposal::Table, RideDeletionProposal::RideId)
                            .to(Ride::Table, Ride::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(RideDeletionProposal::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum RideDeletionProposal {
    Table,
    Id,
    RideId,
    Reason,
    Approved,
    Done,
}
