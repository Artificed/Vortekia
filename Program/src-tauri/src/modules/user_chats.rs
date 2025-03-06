#[tauri::command]
pub fn get_chats_by_category(category: &str) -> Vec<String> {
    match category {
        "executive" => vec![String::from("global_staff"), String::from("executive_chat")],
        "care_and_maintenance" => vec![
            String::from("global_staff"),
            String::from("care_and_maintenance_chat"),
        ],
        "consumption" => vec![
            String::from("global_staff"),
            String::from("consumption_division_chat"),
        ],
        "marketing" => vec![String::from("global_staff"), String::from("marketing_chat")],
        "operation" => vec![
            String::from("global_staff"),
            String::from("operation_division_chat"),
        ],
        "lost_and_found" => vec![String::from("lnf_staff_chat")],
        _ => vec![String::from("global_staff")],
    }
}
