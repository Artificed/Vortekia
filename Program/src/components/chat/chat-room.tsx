import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { invoke } from "@tauri-apps/api/core";

interface Message {
  id?: string;
  user_id: string;
  username: string;
  content: string;
  timestamp: number;
}

interface ChatRoomProps {
  roomId: string;
  userId: string;
  username: string;
}

export const ChatRoom: React.FC<ChatRoomProps> = ({
  roomId,
  userId,
  username,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([]);
    setLoading(true);

    const fetchMessages = async () => {
      try {
        const fetchedMessages = await invoke<Message[]>("get_messages", {
          roomId,
          limit: 50,
        });
        setMessages(fetchedMessages);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
        setLoading(false);
      }
    };

    fetchMessages();

    const interval = setInterval(fetchMessages, 1000);

    return () => clearInterval(interval);
  }, [roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      await invoke("send_message", {
        roomId,
        userId,
        username,
        content: newMessage,
      });

      setNewMessage("");
      const updatedMessages = await invoke<Message[]>("get_messages", {
        roomId,
        limit: 50,
      });
      setMessages(updatedMessages);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle>Chat Room: {roomId}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 pr-4 mb-4">
          {loading ? (
            <div className="text-center py-4">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No messages yet. Start the conversation!
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={message.id || index}
                  className={`flex items-start gap-2 ${
                    message.user_id === userId ? "flex-row-reverse" : ""
                  }`}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {message.username.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`max-w-md rounded-lg px-4 py-2 ${
                      message.user_id === userId
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium">
                        {message.user_id === userId ? "You" : message.username}
                      </span>
                      <span className="text-xs opacity-70">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                    <p>{message.content}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>

        <div className="flex gap-2 mt-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <Button onClick={handleSendMessage}>Send</Button>
        </div>
      </CardContent>
    </Card>
  );
};
