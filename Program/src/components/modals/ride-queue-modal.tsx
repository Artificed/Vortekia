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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useGetRideQueueByRide } from "@/hooks/data/use-get-ride-queue-by-ride";
import { ToastUtils } from "@/components/utils/toast-helper";
import RideWithStaff from "@/lib/interfaces/viewmodels/ride-with-staff";
import RideQueue from "@/lib/interfaces/entities/ride-queue";
import { invoke } from "@tauri-apps/api/core";

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

    try {
      await invoke("add_customer_to_ride_queue", {
        rideId: ride.id,
        customerId: newCustomerId,
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
      await invoke("remove_customer_from_ride_queue", { queueId });

      ToastUtils.success({ description: "Customer removed from queue" });
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
      await invoke("update_ride_queue_entry", {
        queueId: editingQueue.id,
        customerId: editingQueue.customerId,
        startTime: editingQueue.startTime,
        endTime: editingQueue.endTime,
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

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateWaitTime = (startTime: Date, endTime: Date) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMinutes = Math.round(
      (end.getTime() - start.getTime()) / (1000 * 60),
    );
    return diffMinutes;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[90vw] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-3">
            Queue Management for {ride.name}
            <Badge variant="default">Active Queue</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* Add Customer Section */}
          <div className="flex gap-2">
            {isAddingCustomer ? (
              <>
                <Input
                  placeholder="Enter Customer ID"
                  value={newCustomerId}
                  onChange={(e) => setNewCustomerId(e.target.value)}
                  className="flex-grow"
                />
                <Button onClick={addCustomerToQueue}>Confirm</Button>
                <Button
                  variant="secondary"
                  onClick={() => setIsAddingCustomer(false)}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsAddingCustomer(true)}>
                Add Customer to Queue
              </Button>
            )}
          </div>

          {/* Queue Table */}
          <div className="max-h-96 overflow-y-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Customer ID</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>End Time</TableHead>
                  <TableHead>Wait Time</TableHead>
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
                      <TableCell>
                        {editingQueue?.id === queueEntry.id ? (
                          <Input
                            value={editingQueue.customerId}
                            onChange={(e) =>
                              setEditingQueue({
                                ...editingQueue,
                                customerId: e.target.value,
                              })
                            }
                          />
                        ) : (
                          queueEntry.customerId
                        )}
                      </TableCell>
                      <TableCell>{formatTime(queueEntry.startTime)}</TableCell>
                      <TableCell>{formatTime(queueEntry.endTime)}</TableCell>
                      <TableCell>
                        {calculateWaitTime(
                          queueEntry.startTime,
                          queueEntry.endTime,
                        )}{" "}
                        mins
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
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button variant="destructive" size="sm">
                                    Remove
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                  <div className="flex flex-col gap-2">
                                    <p>
                                      Are you sure you want to remove this
                                      customer?
                                    </p>
                                    <Button
                                      variant="destructive"
                                      onClick={() =>
                                        removeCustomerFromQueue(queueEntry.id)
                                      }
                                    >
                                      Confirm Remove
                                    </Button>
                                  </div>
                                </PopoverContent>
                              </Popover>
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

          {/* Queue Summary */}
          <div className="bg-gray-100 p-4 rounded-md">
            <p className="font-semibold">Queue Summary</p>
            <p>Total People in Queue: {rideQueue?.length || 0}</p>
            {rideQueue && rideQueue.length > 0 && (
              <p>
                Estimated Longest Wait:{" "}
                {calculateWaitTime(
                  rideQueue[rideQueue.length - 1].startTime,
                  rideQueue[rideQueue.length - 1].endTime,
                )}{" "}
                mins
              </p>
            )}
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
      </DialogContent>
    </Dialog>
  );
}
