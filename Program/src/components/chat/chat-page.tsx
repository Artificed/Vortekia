import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChatRoomList } from "@/components/chat/chat-room-list";
import { ChatRoom } from "@/components/chat/chat-room";
import useAuth from "@/hooks/auth/use-auth";

const ChatPage: React.FC = () => {
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const auth = useAuth();

  if (!auth?.user) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-primary text-primary-foreground p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span>Chatting as {auth.user.username}</span>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden p-4 gap-4">
        <div className="w-64 h-full">
          <ChatRoomList
            userId={auth.user.id}
            onSelectRoom={(roomId) => setSelectedRoomId(roomId)}
            selectedRoomId={selectedRoomId || undefined}
          />
        </div>
        <div className="flex-1 h-full">
          {selectedRoomId ? (
            <ChatRoom
              roomId={selectedRoomId}
              userId={auth.user.id}
              username={auth.user.username}
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
