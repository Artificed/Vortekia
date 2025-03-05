use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(MaintenanceRequest::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(MaintenanceRequest::Id)
                            .string()
                            .not_null()
                            .primary_key(),
                    )
                    .col(string(MaintenanceRequest::Title).not_null())
                    .col(string(MaintenanceRequest::Content).not_null())
                    .col(boolean(MaintenanceRequest::Approved).not_null())
                    .col(boolean(MaintenanceRequest::Done).not_null())
                    .col(string(MaintenanceRequest::CreatedAt).date_time().not_null())
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(MaintenanceRequest::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum MaintenanceRequest {
    Table,
    Id,
    Title,
    Content,
    Approved,
    Done,
    CreatedAt,
}
