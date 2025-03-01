pub use sea_orm_migration::prelude::*;

pub struct Migrator;
mod m20250225_065344_create_customers;
mod m20250225_065835_create_staff;
mod m20250226_005943_create_lost_and_found_log;
mod m20250226_010030_create_ride;
mod m20250226_012054_create_restaurant;
mod m20250226_013611_create_menu;
mod m20250226_033044_create_ride_queue;
mod m20250226_040740_create_restaurant_staff;
mod m20250226_042701_create_store;
mod m20250226_043305_create_souvenir;
mod m20250226_044541_create_store_staff;
mod m20250226_045711_create_new_ride_proposal;
mod m20250226_050440_create_ride_deletion_proposal;
mod m20250226_060904_create_new_restaurant_proposal;
mod m20250226_070954_create_new_store_proposal;
mod m20250226_074110_create_store_deletion_proposal;
mod m20250226_075303_create_store_transaction;
mod m20250301_052358_seed_staff;
mod m20250301_104705_create_staff_schedule;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20250225_065344_create_customers::Migration),
            Box::new(m20250225_065835_create_staff::Migration),
            Box::new(m20250226_005943_create_lost_and_found_log::Migration),
            Box::new(m20250226_010030_create_ride::Migration),
            Box::new(m20250226_012054_create_restaurant::Migration),
            Box::new(m20250226_013611_create_menu::Migration),
            Box::new(m20250226_033044_create_ride_queue::Migration),
            Box::new(m20250226_040740_create_restaurant_staff::Migration),
            Box::new(m20250226_042701_create_store::Migration),
            Box::new(m20250226_043305_create_souvenir::Migration),
            Box::new(m20250226_044541_create_store_staff::Migration),
            Box::new(m20250226_045711_create_new_ride_proposal::Migration),
            Box::new(m20250226_050440_create_ride_deletion_proposal::Migration),
            Box::new(m20250226_060904_create_new_restaurant_proposal::Migration),
            Box::new(m20250226_070954_create_new_store_proposal::Migration),
            Box::new(m20250226_074110_create_store_deletion_proposal::Migration),
            Box::new(m20250226_075303_create_store_transaction::Migration),
            Box::new(m20250301_052358_seed_staff::Migration),
            Box::new(m20250301_104705_create_staff_schedule::Migration),
        ]
    }
}
