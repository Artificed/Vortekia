use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Staff::Table)
                    .if_not_exists()
                    .col(ColumnDef::new(Staff::Id).string().not_null().primary_key())
                    .col(string(Staff::Username).not_null())
                    .col(string(Staff::Password).not_null())
                    .col(string(Staff::Role).not_null())
                    .col(string(Staff::ShiftStart).time().not_null())
                    .col(string(Staff::ShiftEnd).time().not_null())
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Staff::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
pub enum Staff {
    Table,
    Id,
    Username,
    Password,
    Role,
    ShiftStart,
    ShiftEnd,
}
