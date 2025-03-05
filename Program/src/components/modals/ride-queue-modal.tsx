import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetRideQueueByRide } from "@/hooks/data/use-get-ride-queue-by-ride";
import { ToastUtils } from "@/components/utils/toast-helper";
import RideWithStaff from "@/lib/interfaces/viewmodels/ride-with-staff";
import RideQueue from "@/lib/interfaces/entities/ride-queue";
import { invoke } from "@tauri-apps/api/core";
import { useGetRideQueueRequests } from "@/hooks/data/use-get-ride-queue-requests";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import QueueRequest from "@/lib/interfaces/entities/queue-request";
import { TimeSelectionModal } from "./time-selection-modal";

interface RideQueueModalProps {
  rideWithStaff: RideWithStaff | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function RideQueueModal({
  rideWithStaff,
  isOpen,
  onOpenChange,
}: RideQueueModalProps) {
  const [newCustomerId, setNewCustomerId] = useState("");
  const [editingQueue, setEditingQueue] = useState<RideQueue | null>(null);
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
  const [selectedOpeningTime, setSelectedOpeningTime] = useState("");
  const [selectedClosingTime, setSelectedClosingTime] = useState("");

  const timeOptions = Array.from({ length: 13 }, (_, i) => {
    const hour = i + 7;
    return `${hour.toString().padStart(2, "0")}:00`;
  });

  const handleTimeConfirm = (openingTime: string, closingTime: string) => {
    setSelectedOpeningTime(openingTime);
    setSelectedClosingTime(closingTime);
    setIsTimeModalOpen(false);
    setIsAddingCustomer(true);
  };

  const openTimeSelection = () => {
    setIsTimeModalOpen(true);
  };

  const { rideQueueRequests } = useGetRideQueueRequests(
    rideWithStaff?.ride.id || "",
  );

  const { rideQueue, isLoading, isError, refetch } = useGetRideQueueByRide(
    rideWithStaff?.ride.id || "",
  );

  if (!rideWithStaff) return null;

  const { ride } = rideWithStaff;

  const addCustomerToQueue = async () => {
    if (!newCustomerId.trim()) {
      ToastUtils.error({ description: "Customer ID cannot be empty" });
      return;
    }

    let startTime = new Date();
    if (selectedOpeningTime) {
      const [hour, minute] = selectedOpeningTime.split(":").map(Number);
      startTime.setHours(hour + 7, minute, 0, 0);
    }
    let start = startTime.toISOString().slice(0, 19).replace("T", " ");

    let endTime = new Date();
    if (selectedClosingTime) {
      const [hour, minute] = selectedClosingTime.split(":").map(Number);
      endTime.setHours(hour + 7, minute, 0, 0);
    }
    let end = endTime.toISOString().slice(0, 19).replace("T", " ");

    try {
      await invoke("update_queue_request_approval", {
        id: newCustomerId,
        approve: 1,
        startTime: start,
        endTime: end,
      });

      ToastUtils.success({ description: "Customer added to queue" });
      setNewCustomerId("");
      setIsAddingCustomer(false);
      refetch();
    } catch (error) {
      ToastUtils.error({
        description: `Failed to add customer: ${String(error)}`,
      });
    }
  };

  const removeCustomerFromQueue = async (queueId: string) => {
    try {
      await invoke("delete_ride_queue", { id: queueId });
      ToastUtils.success({
        description: "Successfully removed entry from queue",
      });
      refetch();
    } catch (error) {
      ToastUtils.error({
        description: `Failed to remove customer: ${String(error)}`,
      });
    }
  };

  const updateQueueEntry = async () => {
    if (!editingQueue) return;

    try {
      const startTime = new Date();
      const [startHour, startMinute] = editingQueue.startTime
        ? new Date(editingQueue.startTime)
            .toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })
            .split(":")
            .map(Number)
        : [7, 0];
      startTime.setHours(startHour + 7, startMinute, 0, 0);
      const start = startTime.toISOString().slice(0, 19).replace("T", " ");

      const endTime = new Date();
      const [endHour, endMinute] = editingQueue.endTime
        ? new Date(editingQueue.endTime)
            .toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })
            .split(":")
            .map(Number)
        : [19, 0];
      endTime.setHours(endHour + 7, endMinute, 0, 0);
      const end = endTime.toISOString().slice(0, 19).replace("T", " ");

      await invoke("update_ride_queue", {
        id: editingQueue.id,
        rideId: editingQueue.rideId,
        customerId: editingQueue.customerId,
        startTime: start,
        endTime: end,
      });

      ToastUtils.success({ description: "Queue entry updated" });
      setEditingQueue(null);
      refetch();
    } catch (error) {
      ToastUtils.error({
        description: `Failed to update queue entry: ${String(error)}`,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-screen min-w-[80vw] min-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-3">
            Queue Management for {ride.name}
            <Badge variant="default">Active Queue</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            {isAddingCustomer ? (
              <>
                <Select
                  value={newCustomerId}
                  onValueChange={(value) => setNewCustomerId(value)}
                >
                  <SelectTrigger className="flex-grow">
                    <SelectValue placeholder="Select Customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {rideQueueRequests &&
                      rideQueueRequests.map((request: QueueRequest) => (
                        <SelectItem key={request.id} value={request.id}>
                          {"Request Code: " +
                            request.id +
                            " - Customer (" +
                            request.customerId +
                            ")"}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <Button onClick={addCustomerToQueue}>Confirm</Button>
                <Button
                  variant="secondary"
                  onClick={() => setIsAddingCustomer(false)}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={openTimeSelection}>Add Customer to Queue</Button>
            )}
          </div>

          <div className="h-full w-full overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer ID</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>End Time</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      Loading queue...
                    </TableCell>
                  </TableRow>
                ) : isError ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-red-500">
                      Error loading queue
                    </TableCell>
                  </TableRow>
                ) : rideQueue && rideQueue.length > 0 ? (
                  rideQueue.map((queueEntry: RideQueue) => (
                    <TableRow key={queueEntry.id}>
                      <TableCell>{queueEntry.customerId}</TableCell>
                      <TableCell>
                        {editingQueue?.id === queueEntry.id ? (
                          <Select
                            value={
                              editingQueue.startTime
                                ? new Date(
                                    editingQueue.startTime,
                                  ).toLocaleTimeString("en-US", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: false,
                                  })
                                : "07:00"
                            }
                            onValueChange={(value) =>
                              setEditingQueue({
                                ...editingQueue,
                                startTime: new Date(`1970-01-01T${value}:00`),
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Start Time" />
                            </SelectTrigger>
                            <SelectContent>
                              {timeOptions.map((time) => (
                                <SelectItem
                                  key={time}
                                  value={time}
                                  disabled={
                                    editingQueue.endTime
                                      ? time >=
                                        new Date(
                                          editingQueue.endTime,
                                        ).toLocaleTimeString("en-US", {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                          hour12: false,
                                        })
                                      : false
                                  }
                                >
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : queueEntry.startTime ? (
                          new Date(queueEntry.startTime).toLocaleString()
                        ) : (
                          "N/A"
                        )}
                      </TableCell>
                      <TableCell>
                        {editingQueue?.id === queueEntry.id ? (
                          <Select
                            value={
                              editingQueue.endTime
                                ? new Date(
                                    editingQueue.endTime,
                                  ).toLocaleTimeString("en-US", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: false,
                                  })
                                : "19:00"
                            }
                            onValueChange={(value) =>
                              setEditingQueue({
                                ...editingQueue,
                                endTime: new Date(`1970-01-01T${value}:00`),
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="End Time" />
                            </SelectTrigger>
                            <SelectContent>
                              {timeOptions.map((time) => (
                                <SelectItem
                                  key={time}
                                  value={time}
                                  disabled={
                                    editingQueue.startTime
                                      ? time <=
                                        new Date(
                                          editingQueue.startTime,
                                        ).toLocaleTimeString("en-US", {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                          hour12: false,
                                        })
                                      : false
                                  }
                                >
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : queueEntry.endTime ? (
                          new Date(queueEntry.endTime).toLocaleString()
                        ) : (
                          "N/A"
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {editingQueue?.id === queueEntry.id ? (
                            <>
                              <Button
                                variant="default"
                                size="sm"
                                onClick={updateQueueEntry}
                              >
                                Save
                              </Button>
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => setEditingQueue(null)}
                              >
                                Cancel
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingQueue(queueEntry)}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() =>
                                  removeCustomerFromQueue(queueEntry.id)
                                }
                              >
                                Remove
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-gray-500"
                    >
                      No queue entries
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="bg-gray-100 p-4 rounded-md">
            <p>Total People in Queue: {rideQueue?.length || 0}</p>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Close</Button>
          </DialogClose>
          <Button
            variant="default"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            Refresh Queue
          </Button>
        </DialogFooter>

        <TimeSelectionModal
          isOpen={isTimeModalOpen}
          onClose={() => setIsTimeModalOpen(false)}
          onConfirm={handleTimeConfirm}
          title="Select Ride Schedule"
        />
      </DialogContent>
    </Dialog>
  );
}
