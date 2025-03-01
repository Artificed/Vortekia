import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface TimeSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (openingTime: string, closingTime: string) => void;
  title: string;
}

export function TimeSelectionModal({
  isOpen,
  onClose,
  onConfirm,
  title,
}: TimeSelectionModalProps) {
  const [openingTime, setOpeningTime] = useState<string>("09:00");
  const [closingTime, setClosingTime] = useState<string>("17:00");

  const timeOptions = Array.from({ length: 13 }, (_, i) => {
    const hour = i + 7;
    return `${hour.toString().padStart(2, "0")}:00`;
  });

  const handleConfirm = () => {
    onConfirm(openingTime, closingTime);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Please select the operating hours for this ride.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="opening-time" className="text-right">
              Opens at
            </Label>
            <Select value={openingTime} onValueChange={setOpeningTime}>
              <SelectTrigger className="col-span-3" id="opening-time">
                <SelectValue placeholder="Select opening time" />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map((time) => (
                  <SelectItem
                    key={`open-${time}`}
                    value={time}
                    disabled={!!closingTime && time >= closingTime}
                  >
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="closing-time" className="text-right">
              Closes at
            </Label>
            <Select value={closingTime} onValueChange={setClosingTime}>
              <SelectTrigger className="col-span-3" id="closing-time">
                <SelectValue placeholder="Select closing time" />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map((time) => (
                  <SelectItem
                    key={`close-${time}`}
                    value={time}
                    disabled={!!openingTime && time <= openingTime}
                  >
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
