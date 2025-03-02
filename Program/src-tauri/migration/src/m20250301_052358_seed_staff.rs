use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .exec_stmt(
                Query::insert()
                    .into_table(Staff::Table)
                    .columns([
                        Staff::Id,
                        Staff::Username,
                        Staff::Password,
                        Staff::Role,
                        Staff::ShiftStart,
                        Staff::ShiftEnd,
                    ])
                    .values_panic([
                        "STFDJKSA".into(),
                        "coo".into(),
                        "$argon2id$v=19$m=19456,t=2,p=1$cm1cCsgZQM4oBmo9In53Qw$phz9zhWDCn+HcClHH39u2E0907K2xmVQV10lwsThlWs".into(),
                        "coo".into(),
                        "07:00:00".into(),
                        "19:00:00".into(),
                    ])
                    .values_panic([
                        "STFDSAKASD".into(),
                        "cs".into(),
                        "$argon2id$v=19$m=19456,t=2,p=1$OhjS0JADEvZARktO4jOd8Q$Da8KmsI5M7rWm7TDv2+b/+g/C9hVkKekius26e5+cPQ".into(),
                        "Customer Service".into(),
                        "09:00:00".into(),
                        "17:00:00".into(),
                    ])
                    .values_panic([
                        "STFDSAASD".into(),
                        "ridemane".into(),
                        "$argon2id$v=19$m=19456,t=2,p=1$9Wo2/VkpYEak6KxLoajozw$i7VIYg9FLweWNjSC9ooN/Ge2CnUucyJzG4mDml//nuE".into(),
                        "Ride Manager".into(),
                        "11:00:00".into(),
                        "19:00:00".into(),
                    ])
                    .values_panic([
                        "STFDSADS".into(),
                        "ridestaff1".into(),
                        "$argon2id$v=19$m=19456,t=2,p=1$9Wo2/VkpYEak6KxLoajozw$i7VIYg9FLweWNjSC9ooN/Ge2CnUucyJzG4mDml//nuE".into(),
                        "Ride Staff".into(),
                        "07:00:00".into(),
                        "15:00:00".into(),
                    ])
                    .values_panic([
                        "STFDSAVD".into(),
                        "ridestaff2".into(),
                        "$argon2id$v=19$m=19456,t=2,p=1$9Wo2/VkpYEak6KxLoajozw$i7VIYg9FLweWNjSC9ooN/Ge2CnUucyJzG4mDml//nuE".into(),
                        "Ride Staff".into(),
                        "11:00:00".into(),
                        "19:00:00".into(),
                    ])
                    .values_panic([
                        "STFDRMMM".into(),
                        "rm".into(),
                        "$argon2id$v=19$m=19456,t=2,p=1$Ur+JrOYL7XWhmuEGdNddsg$XB77iUopFfR5N/G/njP3mrBGz3R9HHkrM9/tgNtUFzM".into(),
                        "Retail Manager".into(),
                        "09:00:00".into(),
                        "17:00:00".into(),
                    ])
                    .values_panic([
                        "STFDRMSA".into(),
                        "sa".into(),
                        "$argon2id$v=19$m=19456,t=2,p=1$Ur+JrOYL7XWhmuEGdNddsg$XB77iUopFfR5N/G/njP3mrBGz3R9HHkrM9/tgNtUFzM".into(),
                        "Sales Associate".into(),
                        "09:00:00".into(),
                        "17:00:00".into(),
                    ])
                    .values_panic([
                        "STFDRMS1".into(),
                        "saa".into(),
                        "$argon2id$v=19$m=19456,t=2,p=1$Ur+JrOYL7XWhmuEGdNddsg$XB77iUopFfR5N/G/njP3mrBGz3R9HHkrM9/tgNtUFzM".into(),
                        "Sales Associate".into(),
                        "11:00:00".into(),
                        "19:00:00".into(),
                    ])
                    .values_panic([
                        "STFDRMS2".into(),
                        "saaa".into(),
                        "$argon2id$v=19$m=19456,t=2,p=1$Ur+JrOYL7XWhmuEGdNddsg$XB77iUopFfR5N/G/njP3mrBGz3R9HHkrM9/tgNtUFzM".into(),
                        "Sales Associate".into(),
                        "07:00:00".into(),
                        "15:00:00".into(),
                    ])
                    .values_panic([
                        "STFDRCEO".into(),
                        "ceo".into(),
                        "$argon2id$v=19$m=19456,t=2,p=1$dkjPCdjeKKK8k18D073DXA$mAmCj90P2TrX9OzEdnObExYIMU3weTnUJfKJRTFQ4Z4".into(),
                        "CEO".into(),
                        "07:00:00".into(),
                        "19:00:00".into(),
                    ])
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .exec_stmt(Query::delete().from_table(Staff::Table).to_owned())
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
