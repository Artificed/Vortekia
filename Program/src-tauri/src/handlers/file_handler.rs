use std::{
    fs::{self, File},
    io::Write,
};

pub fn save_image_to_disk(image_name: &str, image_bytes: &Vec<u8>) -> Result<String, String> {
    let images_dir = "../uploads";

    fs::create_dir_all(images_dir).map_err(|e| format!("Failed to create dir: {}", e))?;

    let file_path = format!("{}/{}", images_dir, image_name);

    let mut file = File::create(&file_path).map_err(|e| format!("Failed to create file: {}", e))?;
    file.write_all(image_bytes)
        .map_err(|e| format!("Failed to write file: {}", e))?;

    Ok(file_path)
}
