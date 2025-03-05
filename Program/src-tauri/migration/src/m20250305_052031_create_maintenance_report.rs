use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(MaintenanceReport::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(MaintenanceReport::Id)
                            .string()
                            .not_null()
                            .primary_key(),
                    )
                    .col(string(MaintenanceReport::Title).not_null())
                    .col(string(MaintenanceReport::Content).not_null())
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(MaintenanceReport::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum MaintenanceReport {
    Table,
    Id,
    Title,
    Content,
}
