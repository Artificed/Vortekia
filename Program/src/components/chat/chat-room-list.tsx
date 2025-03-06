import React, { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { invoke } from "@tauri-apps/api/core";
import { useGetAllowedChats } from "@/hooks/utility/use-get-allowed-chats";

interface ChatRoom {
  id?: string;
  name: string;
  description?: string;
  created_by: string;
}

interface ChatRoomListProps {
  userId: string;
  onSelectRoom: (roomId: string) => void;
  selectedRoomId?: string;
}

export const ChatRoomList: React.FC<ChatRoomListProps> = ({
  onSelectRoom,
  selectedRoomId,
}) => {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);
  // Get allowed chat IDs (assumed to be an array)
  const allowedChats = useGetAllowedChats();

  const fetchRooms = async () => {
    try {
      const chatRooms = await invoke<ChatRoom[]>("list_chat_rooms");
      // Only filter if allowedChats is non-empty
      const filteredRooms =
        allowedChats.length > 0
          ? chatRooms.filter(
              (room) => room.id && allowedChats.includes(room.id),
            )
          : [];
      setRooms(filteredRooms);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch chat rooms:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch rooms if allowedChats is ready.
    // If allowedChats is still an empty array because it's not loaded yet, do nothing.
    if (!allowedChats || allowedChats.length === 0) {
      setLoading(true);
      return;
    }

    fetchRooms();
    const interval = setInterval(fetchRooms, 10000);
    return () => clearInterval(interval);
  }, [allowedChats]);

  return (
    <Card className="h-full flex flex-col">
      <CardContent className="pt-6 flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Chat Rooms</h3>
        </div>

        <ScrollArea className="flex-1">
          {loading ? (
            <div className="text-center py-4">Loading rooms...</div>
          ) : rooms.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No chat rooms available. Create one to get started!
            </div>
          ) : (
            <div className="space-y-2">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className={`p-3 rounded-md cursor-pointer hover:bg-accent transition-colors ${
                    selectedRoomId === room.id ? "bg-accent" : ""
                  }`}
                  onClick={() => room.id && onSelectRoom(room.id)}
                >
                  <div className="font-medium">{room.name || room.id}</div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
