use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

use crate::{m20250225_065344_create_customers::Customer, m20250225_065835_create_staff::Staff};

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(LostAndFoundLog::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(LostAndFoundLog::Id)
                            .string()
                            .not_null()
                            .primary_key(),
                    )
                    .col(string(LostAndFoundLog::Image).not_null())
                    .col(string(LostAndFoundLog::Name).not_null())
                    .col(string(LostAndFoundLog::Type).not_null())
                    .col(string(LostAndFoundLog::Color).not_null())
                    .col(string(LostAndFoundLog::LastSeenLocation).not_null())
                    .col(string(LostAndFoundLog::Finder).not_null())
                    .col(string(LostAndFoundLog::Owner).not_null())
                    .col(string(LostAndFoundLog::Status).not_null())
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_finder_id")
                            .from(LostAndFoundLog::Table, LostAndFoundLog::Finder)
                            .to(Staff::Table, Staff::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_owner_id")
                            .from(LostAndFoundLog::Table, LostAndFoundLog::Owner)
                            .to(Customer::Table, Customer::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(LostAndFoundLog::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum LostAndFoundLog {
    Table,
    Id,
    Image,
    Name,
    Type,
    Color,
    LastSeenLocation,
    Finder,
    Owner,
    Status,
}
