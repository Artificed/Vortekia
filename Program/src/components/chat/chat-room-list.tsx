import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { invoke } from "@tauri-apps/api/core";

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
  userId,
  onSelectRoom,
  selectedRoomId,
}) => {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomDescription, setNewRoomDescription] = useState("");

  const fetchRooms = async () => {
    try {
      const chatRooms = await invoke<ChatRoom[]>("list_chat_rooms");
      setRooms(chatRooms);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch chat rooms:", error);
    }
  };

  useEffect(() => {
    fetchRooms();

    // Refresh rooms periodically
    const interval = setInterval(fetchRooms, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateRoom = async () => {
    if (!newRoomName.trim()) return;

    try {
      await invoke("create_chat_room", {
        name: newRoomName,
        description: newRoomDescription || null,
        userId,
      });

      setNewRoomName("");
      setNewRoomDescription("");
      setIsDialogOpen(false);

      // Refresh the room list
      fetchRooms();
    } catch (error) {
      console.error("Failed to create room:", error);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardContent className="pt-6 flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Chat Rooms</h3>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                New Room
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Chat Room</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="room-name" className="text-sm font-medium">
                    Room Name
                  </label>
                  <Input
                    id="room-name"
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    placeholder="Enter room name"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="room-desc" className="text-sm font-medium">
                    Description (optional)
                  </label>
                  <Input
                    id="room-desc"
                    value={newRoomDescription}
                    onChange={(e) => setNewRoomDescription(e.target.value)}
                    placeholder="Enter room description"
                  />
                </div>
                <Button onClick={handleCreateRoom} className="w-full">
                  Create Room
                </Button>
              </div>
            </DialogContent>
          </Dialog>
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
                  <div className="font-medium">{room.name}</div>
                  {room.description && (
                    <div className="text-sm text-gray-500 mt-1 truncate">
                      {room.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
