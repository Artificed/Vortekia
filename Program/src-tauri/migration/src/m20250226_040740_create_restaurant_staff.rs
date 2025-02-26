use sea_orm_migration::{prelude::*, schema::*};

use crate::{m20250225_065835_create_staff::Staff, m20250226_012054_create_restaurant::Restaurant};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(RestaurantStaff::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(RestaurantStaff::Id)
                            .string()
                            .not_null()
                            .primary_key(),
                    )
                    .col(string(RestaurantStaff::StaffId).not_null())
                    .col(string(RestaurantStaff::RestaurantId).not_null())
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_restaurant_id")
                            .from(RestaurantStaff::Table, RestaurantStaff::RestaurantId)
                            .to(Restaurant::Table, Restaurant::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_restaurant_staff_staff_id")
                            .from(RestaurantStaff::Table, RestaurantStaff::StaffId)
                            .to(Staff::Table, Staff::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(RestaurantStaff::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum RestaurantStaff {
    Table,
    Id,
    RestaurantId,
    StaffId,
}
