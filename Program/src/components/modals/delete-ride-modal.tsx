import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { invoke } from "@tauri-apps/api/core";
import { ToastUtils } from "../utils/toast-helper";

interface DeleteRideModalProps {
  rideId: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function DeleteRideModal({
  rideId,
  onClose,
  onSuccess,
}: DeleteRideModalProps) {
  const [reason, setReason] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await invoke("insert_ride_deletion_proposal", {
        rideId: rideId,
        reason: reason,
      });
      ToastUtils.success({
        description: "Successfully created ride deletion proposal!",
      });

      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      ToastUtils.error({ description: String(error) });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-lg">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <div className="flex justify-between items-center mb-4">
              <CardTitle>Delete Ride</CardTitle>
              <Button variant="ghost" type="button" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rideId">Ride ID</Label>
              <Input
                id="rideId"
                name="rideId"
                value={rideId}
                className="opacity-50 cursor-not-allowed pointer-events-none"
                readOnly
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason</Label>
              <Textarea
                id="reason"
                name="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter the reason for deleting the ride..."
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-4 mt-5">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="destructive">
              Delete Ride
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
