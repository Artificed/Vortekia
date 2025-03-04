use sea_orm_migration::{prelude::*, schema::*};

use crate::{
    m20250225_065344_create_customers::Customer, m20250226_012054_create_restaurant::Restaurant,
    m20250226_013611_create_menu::Menu,
};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(RestaurantTransaction::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(RestaurantTransaction::Id)
                            .string()
                            .not_null()
                            .primary_key(),
                    )
                    .col(string(RestaurantTransaction::RestaurantId).not_null())
                    .col(string(RestaurantTransaction::MenuId).not_null())
                    .col(string(RestaurantTransaction::CustomerId).not_null())
                    .col(string(RestaurantTransaction::Quantity).integer().not_null())
                    .col(string(RestaurantTransaction::Price).integer().not_null())
                    .col(
                        string(RestaurantTransaction::TransactionDate)
                            .date_time()
                            .not_null(),
                    )
                    .col(string(RestaurantTransaction::Status).not_null())
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_create_restaurant_transaction_restaurant_id")
                            .from(
                                RestaurantTransaction::Table,
                                RestaurantTransaction::RestaurantId,
                            )
                            .to(Restaurant::Table, Restaurant::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_create_restaurant_transaction_menu_id")
                            .from(RestaurantTransaction::Table, RestaurantTransaction::MenuId)
                            .to(Menu::Table, Menu::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_create_restaurant_transaction_customer_id")
                            .from(
                                RestaurantTransaction::Table,
                                RestaurantTransaction::CustomerId,
                            )
                            .to(Customer::Table, Customer::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(RestaurantTransaction::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum RestaurantTransaction {
    Table,
    Id,
    RestaurantId,
    MenuId,
    CustomerId,
    Quantity,
    Price,
    TransactionDate,
    Status,
}
