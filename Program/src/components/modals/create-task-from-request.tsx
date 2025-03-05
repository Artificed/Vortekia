import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ToastUtils } from "@/components/utils/toast-helper";
import type MaintenanceRequest from "@/lib/interfaces/entities/maintenance-request";
import type MaintenanceTask from "@/lib/interfaces/entities/maintenance-task";
import { useGetMaintenanceStaffs } from "@/hooks/data/use-get-maintenance-staffs";

const generateTimeOptions = () => {
  const options = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const formattedHour = hour.toString().padStart(2, "0");
      const formattedMinute = minute.toString().padStart(2, "0");
      options.push(`${formattedHour}:${formattedMinute}`);
    }
  }
  return options;
};

const timeOptions = generateTimeOptions();

interface CreateTaskFromRequestModalProps {
  request: MaintenanceRequest;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: MaintenanceTask) => void;
  isSubmitting: boolean;
}

export function CreateTaskFromRequestModal({
  request,
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: CreateTaskFromRequestModalProps) {
  const [formData, setFormData] = useState<Partial<MaintenanceTask>>({
    name: request.title,
    description: request.content,
    status: "Pending",
  });

  const { maintenanceStaffs } = useGetMaintenanceStaffs();

  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [startTimeString, setStartTimeString] = useState<string>("");
  const [endTimeString, setEndTimeString] = useState<string>("");
  const [selectedStaffId, setSelectedStaffId] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.description) {
      ToastUtils.error({
        description: "Please fill in all required fields",
      });
      return;
    }

    if (!startDate || !endDate) {
      ToastUtils.error({
        description: "Please select start and end dates",
      });
      return;
    }

    if (!startTimeString || !endTimeString) {
      ToastUtils.error({
        description: "Please select start and end times",
      });
      return;
    }

    if (!selectedStaffId) {
      ToastUtils.error({
        description: "Please select a staff member",
      });
      return;
    }

    const startDateTime = new Date(startDate);
    const endDateTime = new Date(endDate);

    const [startHours, startMinutes] = startTimeString.split(":").map(Number);
    const [endHours, endMinutes] = endTimeString.split(":").map(Number);

    startDateTime.setHours(startHours, startMinutes, 0, 0);
    endDateTime.setHours(endHours, endMinutes, 0, 0);

    if (endDateTime <= startDateTime) {
      ToastUtils.error({
        description: "End time must be after start time",
      });
      return;
    }

    const selectedStaff = (maintenanceStaffs || []).find(
      (staff) => staff.id === selectedStaffId,
    );

    if (!selectedStaff) {
      ToastUtils.error({
        description: "Invalid staff selection",
      });
      return;
    }

    const task: MaintenanceTask = {
      id: Math.floor(Math.random() * 1000),
      name: formData.name!,
      description: formData.description!,
      assignedStaff: selectedStaff.id,
      startTime: startDateTime,
      endTime: endDateTime,
      status: formData.status || "Scheduled",
    };

    onSubmit(task);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Create Maintenance Task
          </DialogTitle>
          <DialogDescription>
            Convert this request into a scheduled maintenance task
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="taskName" className="text-right">
              Task Name
            </Label>
            <input
              id="taskName"
              name="name"
              value="Ride Maintenance"
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Enter task name"
              required
              disabled
              className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Describe the maintenance task"
              required
              className="col-span-3 min-h-24"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="assignedStaff" className="text-right">
              Assigned Staff
            </Label>
            <Select value={selectedStaffId} onValueChange={setSelectedStaffId}>
              <SelectTrigger className="col-span-3" id="assignedStaff">
                <SelectValue placeholder="Select staff member" />
              </SelectTrigger>
              <SelectContent>
                {(maintenanceStaffs || []).map((staff) => (
                  <SelectItem key={staff.id} value={staff.id}>
                    {staff.username} - {staff.role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="start-date" className="text-right">
              Start Date
            </Label>
            <div className="col-span-3">
              <Popover>
                <PopoverTrigger>
                  <Button
                    id="start-date"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? (
                      format(startDate, "PPP")
                    ) : (
                      <span>Select start date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="start-time" className="text-right">
              Start Time
            </Label>
            <Select value={startTimeString} onValueChange={setStartTimeString}>
              <SelectTrigger className="col-span-3" id="start-time">
                <SelectValue placeholder="Select start time" />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map((time) => (
                  <SelectItem key={`start-${time}`} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="end-date" className="text-right">
              End Date
            </Label>
            <div className="col-span-3">
              <Popover>
                <PopoverTrigger>
                  <Button
                    id="end-date"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? (
                      format(endDate, "PPP")
                    ) : (
                      <span>Select end date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="end-time" className="text-right">
              End Time
            </Label>
            <Select value={endTimeString} onValueChange={setEndTimeString}>
              <SelectTrigger className="col-span-3" id="end-time">
                <SelectValue placeholder="Select end time" />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map((time) => (
                  <SelectItem key={`end-${time}`} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating Task..." : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
