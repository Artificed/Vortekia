use rand::distributions::Alphanumeric;
use rand::Rng;

pub fn generate_customer_id() -> String {
    rand::thread_rng()
        .sample_iter(&Alphanumeric)
        .take(8)
        .map(char::from)
        .collect()
}

pub fn generate_staff_id() -> String {
    let random_part: String = rand::thread_rng()
        .sample_iter(&Alphanumeric)
        .take(5)
        .map(char::from)
        .collect();

    format!("STF{}", random_part)
}
