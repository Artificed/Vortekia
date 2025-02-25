pub use sea_orm_migration::prelude::*;

pub struct Migrator;
mod m20250225_065344_create_customers;
mod m20250225_065835_create_staff;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20250225_065344_create_customers::Migration),
            Box::new(m20250225_065835_create_staff::Migration),
        ]
    }
}
