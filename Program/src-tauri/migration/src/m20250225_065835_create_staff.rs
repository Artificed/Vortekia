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
                    .col(string(Staff::Username))
                    .col(string(Staff::Password))
                    .col(string(Staff::Role))
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
enum Staff {
    Table,
    Id,
    Username,
    Password,
    Role,
}
