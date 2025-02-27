use std::env;

use mime_guess::from_path;
use reqwest::Client;
use urlencoding::encode;

pub async fn upload_image_to_firebase(
    image_name: &str,
    image_bytes: &[u8],
) -> Result<String, String> {
    let firebase_bucket = env::var("FIREBASE_BUCKET").expect("Bucket must be set!");
    let upload_path = format!("uploads/{}", image_name);

    let url = format!(
        "https://firebasestorage.googleapis.com/v0/b/{}/o?uploadType=media&name={}",
        firebase_bucket, upload_path
    );

    let mime_type = from_path(image_name)
        .first_or_octet_stream()
        .essence_str()
        .to_string();

    let client = Client::new();

    let response = client
        .post(&url)
        .header("Content-Type", &mime_type)
        .body(image_bytes.to_vec())
        .send()
        .await
        .map_err(|e| format!("Failed to send request: {}", e))?;

    if response.status().is_success() {
        let encoded_upload_path = encode(&upload_path);
        let public_url = format!(
            "https://firebasestorage.googleapis.com/v0/b/{}/o/{}?alt=media",
            firebase_bucket, encoded_upload_path
        );
        Ok(public_url)
    } else {
        let err_text = response
            .text()
            .await
            .unwrap_or_else(|_| "Unknown error".to_string());
        Err(format!("Firebase error: {}", err_text))
    }
}
