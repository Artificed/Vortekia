use sea_orm_migration::{prelude::*, schema::*};

use crate::m20250226_012054_create_restaurant::Restaurant;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Menu::Table)
                    .if_not_exists()
                    .col(ColumnDef::new(Menu::Id).string().not_null().primary_key())
                    .col(string(Menu::RestaurantId).not_null())
                    .col(string(Menu::Name).not_null())
                    .col(string(Menu::Image).not_null())
                    .col(string(Menu::Price).integer().not_null())
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_create_menu_restaurant_id")
                            .from(Menu::Table, Menu::RestaurantId)
                            .to(Restaurant::Table, Restaurant::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Menu::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum Menu {
    Table,
    Id,
    RestaurantId,
    Name,
    Image,
    Price,
}
