import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type MaintenanceTask from "@/lib/interfaces/entities/maintenance-task";
import type MaintenanceLog from "@/lib/interfaces/entities/maintenance-log";
import { format } from "date-fns";
import { Calendar, Clock, User } from "lucide-react";
import { MaintenanceLogForm } from "../partials/maintenance-staff/maintenance-log-form";

interface MaintenanceTaskDetailModalProps {
  task: MaintenanceTask | null;
  isOpen: boolean;
  onClose: () => void;
  logs: MaintenanceLog[];
  onLogSubmitted: () => void;
}

export function MaintenanceTaskDetailModal({
  task,
  isOpen,
  onClose,
  onLogSubmitted,
}: MaintenanceTaskDetailModalProps) {
  if (!task) return null;

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "scheduled":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "in progress":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "delayed":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">
              {task.name}
            </DialogTitle>
            <Badge className={getStatusBadgeColor(task.status)}>
              {task.status}
            </Badge>
          </div>
          <DialogDescription>
            Task #{task.id} - Assigned to you
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">
                  {format(new Date(task.startTime), "MMMM d, yyyy")}
                </span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">
                  {format(new Date(task.startTime), "h:mm a")} -{" "}
                  {format(new Date(task.endTime), "h:mm a")}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">
                  Assigned to: {task.assignedStaff}
                </span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Description</h3>
            <p className="text-sm text-muted-foreground">{task.description}</p>
          </div>

          {task.status === "Incoming" && (
            <div>
              <Separator />
              <h3 className="text-sm font-medium my-4">Submit New Log</h3>
              <MaintenanceLogForm task={task} onSuccess={onLogSubmitted} />{" "}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
