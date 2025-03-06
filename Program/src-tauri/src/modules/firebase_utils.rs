use firebase_rs::Firebase;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use tauri::command;

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Message {
    id: Option<String>,
    user_id: String,
    username: String,
    content: String,
    timestamp: i64,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct ChatRoom {
    id: Option<String>,
    name: Option<String>,
    description: Option<String>,
    created_by: Option<String>,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct UserProfile {
    id: String,
    username: String,
}

pub struct FirebaseConfig {
    firebase: Firebase,
}

impl FirebaseConfig {
    fn new() -> Self {
        let firebase = Firebase::new("https://onlymovie-27550-default-rtdb.firebaseio.com/")
            .expect("Failed to connect to Firebase");
        FirebaseConfig { firebase }
    }

    fn chat_ref(&self) -> &Firebase {
        &self.firebase
    }
}

pub fn init_firebase() -> FirebaseConfig {
    FirebaseConfig::new()
}

#[command]
pub fn create_user_profile(username: String) -> UserProfile {
    UserProfile {
        id: uuid::Uuid::new_v4().to_string(),
        username,
    }
}

#[command]
pub async fn send_message(
    firebase: tauri::State<'_, FirebaseConfig>,
    room_id: String,
    user_id: String,
    username: String,
    content: String,
) -> Result<Message, String> {
    let timestamp = chrono::Utc::now().timestamp();
    let message = Message {
        id: None,
        user_id,
        username,
        content,
        timestamp,
    };

    let chat_path = format!("chats/{}/messages", room_id);
    // Use the Firebase set method properly
    match firebase.chat_ref().at(&chat_path).set(&message).await {
        Ok(_) => Ok(message),
        Err(e) => Err(format!("Failed to send message: {}", e)),
    }
}

#[command]
pub async fn get_messages(
    firebase: tauri::State<'_, FirebaseConfig>,
    room_id: String,
    limit: Option<usize>,
) -> Result<Vec<Message>, String> {
    let chat_path = format!("chats/{}/messages", room_id);

    match firebase
        .chat_ref()
        .at(&chat_path)
        .get::<HashMap<String, Message>>()
        .await
    {
        Ok(messages_map) => {
            let mut messages: Vec<Message> = messages_map
                .into_iter()
                .map(|(key, mut message)| {
                    message.id = Some(key);
                    message
                })
                .collect();

            messages.sort_by(|a, b| a.timestamp.cmp(&b.timestamp));

            if let Some(limit_val) = limit {
                if messages.len() > limit_val {
                    let start_idx = messages.len() - limit_val;
                    messages = messages[start_idx..].to_vec();
                }
            }

            Ok(messages)
        }
        Err(e) => Err(format!("Failed to fetch messages: {}", e)),
    }
}

#[command]
pub async fn create_chat_room(
    firebase: tauri::State<'_, FirebaseConfig>,
    name: String,
    description: Option<String>,
    user_id: String,
) -> Result<ChatRoom, String> {
    let room = ChatRoom {
        id: None,
        name: Some(name),
        description,
        created_by: Some(user_id),
    };

    let room_id = uuid::Uuid::new_v4().to_string();
    match firebase
        .chat_ref()
        .at(&format!("chats/{}", room_id))
        .set(&room)
        .await
    {
        Ok(_) => {
            let mut result = room;
            result.id = Some(room_id);
            Ok(result)
        }
        Err(e) => Err(format!("Failed to create chat room: {}", e)),
    }
}

#[command]
pub async fn list_chat_rooms(
    firebase: tauri::State<'_, FirebaseConfig>,
) -> Result<Vec<ChatRoom>, String> {
    match firebase
        .chat_ref()
        .at("chats")
        .get::<HashMap<String, ChatRoom>>()
        .await
    {
        Ok(rooms_map) => {
            let rooms: Vec<ChatRoom> = rooms_map
                .into_iter()
                .map(|(key, mut room)| {
                    room.id = Some(key);
                    room
                })
                .collect();

            Ok(rooms)
        }
        Err(e) => Err(format!("Failed to list chat rooms: {}", e)),
    }
}
