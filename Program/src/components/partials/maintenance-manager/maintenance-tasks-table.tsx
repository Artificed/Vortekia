import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { RefreshCw } from "lucide-react";
import { useState } from "react";
import MaintenanceTask from "@/lib/interfaces/entities/maintenance-task";

interface MaintenanceTaskTableProps {
  tasks: MaintenanceTask[] | undefined;
  isLoading: boolean;
  isError: boolean;
  onRefresh: () => void;
  onEdit?: (task: MaintenanceTask) => void;
  onDelete?: (task: MaintenanceTask) => void;
  onStatusChange?: (task: MaintenanceTask, newStatus: string) => void;
}

export function MaintenanceTaskTable({
  tasks,
  isLoading,
  isError,
  onRefresh,
}: MaintenanceTaskTableProps) {
  const [sortField, setSortField] =
    useState<keyof MaintenanceTask>("startTime");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (field: keyof MaintenanceTask) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedTasks = tasks
    ? [...tasks].sort((a, b) => {
        if (sortField === "startTime" || sortField === "endTime") {
          const dateA = new Date(a[sortField] as Date);
          const dateB = new Date(b[sortField] as Date);
          return sortDirection === "asc"
            ? dateA.getTime() - dateB.getTime()
            : dateB.getTime() - dateA.getTime();
        } else {
          const valueA = String(a[sortField] || "");
          const valueB = String(b[sortField] || "");
          return sortDirection === "asc"
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
        }
      })
    : [];

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

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="text-red-500 mb-4 text-lg">
          Error loading maintenance tasks
        </div>
        <Button onClick={onRefresh} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Maintenance Tasks</h2>
        <Button
          onClick={onRefresh}
          variant="outline"
          size="sm"
          disabled={isLoading}
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : sortedTasks && sortedTasks.length > 0 ? (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  Task Name
                  {sortField === "name" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("description")}
                >
                  Description
                  {sortField === "description" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("startTime")}
                >
                  Start Time
                  {sortField === "startTime" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("endTime")}
                >
                  End Time
                  {sortField === "endTime" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("status")}
                >
                  Status
                  {sortField === "status" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.name}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {task.description}
                  </TableCell>
                  <TableCell>{task.assignedStaff}</TableCell>
                  <TableCell>
                    {task.startTime
                      ? format(new Date(task.startTime), "MMM d, yyyy h:mm a")
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {task.endTime
                      ? format(new Date(task.endTime), "MMM d, yyyy h:mm a")
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeColor(task.status)}>
                      {task.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 text-center border rounded-md">
          <p className="text-muted-foreground mb-4">
            No maintenance tasks found
          </p>
          <Button onClick={onRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      )}
    </div>
  );
}
