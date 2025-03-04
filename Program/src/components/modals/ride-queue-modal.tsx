import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import RideWithStaff from "@/lib/interfaces/viewmodels/ride-with-staff";

interface RideQueueModalProps {
  rideWithStaff: RideWithStaff | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

interface QueueEntry {
  id: string;
  name: string;
  position: number;
  waitTime: number;
}

export default function RideQueueModal({
  rideWithStaff,
  isOpen,
  onOpenChange,
}: RideQueueModalProps) {
  const [queue, setQueue] = useState<QueueEntry[]>([
    { id: "1", name: "John Doe", position: 1, waitTime: 15 },
    { id: "2", name: "Jane Smith", position: 2, waitTime: 20 },
    { id: "3", name: "Mike Johnson", position: 3, waitTime: 25 },
  ]);

  const [newEntryName, setNewEntryName] = useState("");

  if (!rideWithStaff) return null;

  const { ride } = rideWithStaff;

  const addToQueue = () => {
    if (newEntryName.trim()) {
      const newEntry: QueueEntry = {
        id: (queue.length + 1).toString(),
        name: newEntryName,
        position: queue.length + 1,
        waitTime: 30, // Default wait time
      };
      setQueue([...queue, newEntry]);
      setNewEntryName("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl sm:max-w-3xl mx-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-3">
            Queue Management for {ride.name}
            <Badge variant="default">Active Queue</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter name to add to queue"
              value={newEntryName}
              onChange={(e) => setNewEntryName(e.target.value)}
              className="flex-grow"
            />
            <Button onClick={addToQueue}>Add to Queue</Button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Position</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Estimated Wait</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {queue.map((entry, index) => (
                  <TableRow key={entry.id}>
                    <TableCell>{entry.position}</TableCell>
                    <TableCell>{entry.name}</TableCell>
                    <TableCell>{entry.waitTime} mins</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="destructive"
                          size="sm"
                          // onClick={() => removeFromQueue(entry.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="bg-gray-100 p-4 rounded-md">
            <p className="font-semibold">Queue Summary</p>
            <p>Total People in Queue: {queue.length}</p>
            <p>
              Estimated Longest Wait:{" "}
              {Math.max(...queue.map((e) => e.waitTime))} mins
            </p>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Close</Button>
          </DialogClose>
          <Button variant="default">Save Queue Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
