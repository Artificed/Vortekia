pub use sea_orm_migration::prelude::*;

pub struct Migrator;
mod m20250221_014402_create_users;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![Box::new(m20250221_014402_create_users::Migration)]
    }
}
