import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { invoke } from "@tauri-apps/api/core";
import { ChatRoom } from "./chat-room";
import { ChatRoomList } from "./chat-room-list";

interface User {
  id: string;
  username: string;
}

const ChatPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [username, setUsername] = useState("");

  const handleCreateProfile = async () => {
    if (!username.trim()) return;

    try {
      const newUser = await invoke<User>("create_user_profile", {
        username: username.trim(),
      });

      setUser(newUser);
      setUsername("");
    } catch (error) {
      console.error("Failed to create profile:", error);
    }
  };

  const handleChangeProfile = () => {
    setUser(null);
    setSelectedRoomId(null);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold text-center mb-6">
              Enter Your Display Name
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">
                  Username
                </label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="What should we call you?"
                  required
                />
              </div>
              <Button
                onClick={handleCreateProfile}
                className="w-full"
                disabled={!username.trim()}
              >
                Start Chatting
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-primary text-primary-foreground p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Firebase Chat</h1>
        <div className="flex items-center gap-4">
          <span>Chatting as {user.username}</span>
          <Button variant="outline" size="sm" onClick={handleChangeProfile}>
            Change Name
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden p-4 gap-4">
        <div className="w-64 h-full">
          <ChatRoomList
            userId={user.id}
            onSelectRoom={(roomId) => setSelectedRoomId(roomId)}
            selectedRoomId={selectedRoomId || undefined}
          />
        </div>

        <div className="flex-1 h-full">
          {selectedRoomId ? (
            <ChatRoom
              roomId={selectedRoomId}
              userId={user.id}
              username={user.username}
            />
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center py-8">
                <h2 className="text-xl font-medium mb-2">
                  Welcome to Firebase Chat!
                </h2>
                <p className="text-gray-500 mb-4">
                  Select a chat room from the sidebar or create a new one to
                  start chatting.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
