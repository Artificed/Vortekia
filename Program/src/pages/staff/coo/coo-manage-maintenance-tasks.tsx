import type React from "react";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Filter,
  Search,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Clock,
} from "lucide-react";
import type { DateRange } from "react-day-picker";
import { addDays, format, isWithinInterval } from "date-fns";
import { useGetAllMaintenanceTasks } from "@/hooks/data/use-get-all-maintenance-tasks";
import CooNavbar from "@/components/navbars/coo-navbar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ToastUtils } from "@/components/utils/toast-helper";

export default function CooManageMaintenanceTasks() {
  const { maintenanceTasks, isLoading, refetch } = useGetAllMaintenanceTasks();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [staffFilter, setStaffFilter] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: addDays(new Date(), 30),
  });

  const [filteredTasks, setFilteredTasks] = useState<typeof maintenanceTasks>(
    [],
  );
  const [uniqueStaff, setUniqueStaff] = useState<string[]>([]);

  // Task metrics
  const [totalTasks, setTotalTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [pendingTasks, setPendingTasks] = useState(0);

  // Form state for add/edit dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentTask, setCurrentTask] = useState<any>(null);
  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    description: "",
    assignedStaff: "",
    startTime: "",
    endTime: "",
    status: "pending",
  });

  useEffect(() => {
    if (maintenanceTasks && maintenanceTasks.length > 0) {
      const staffMembers = [
        ...new Set(
          maintenanceTasks.map((task) => task.assignedStaff as string),
        ),
      ];
      setUniqueStaff(staffMembers);
    }
  }, [maintenanceTasks]);

  useEffect(() => {
    if (!maintenanceTasks) return;

    let filtered = [...maintenanceTasks];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.name.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query) ||
          task.assignedStaff.toLowerCase().includes(query),
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (task) => task.status.toLowerCase() === statusFilter.toLowerCase(),
      );
    }

    if (staffFilter !== "all") {
      filtered = filtered.filter((task) => task.assignedStaff === staffFilter);
    }

    if (dateRange?.from && dateRange?.to) {
      filtered = filtered.filter((task) => {
        const startDate = new Date(task.startTime);
        const endDate = new Date(task.endTime);

        return (
          isWithinInterval(startDate, {
            start: dateRange.from!,
            end: dateRange.to!,
          }) ||
          isWithinInterval(endDate, {
            start: dateRange.from!,
            end: dateRange.to!,
          }) ||
          (startDate <= dateRange.from! && endDate >= dateRange.to!)
        );
      });
    }

    setFilteredTasks(filtered);

    // Calculate metrics
    if (maintenanceTasks.length > 0) {
      setTotalTasks(filtered.length);
      setCompletedTasks(
        filtered.filter((task) => task.status.toLowerCase() === "completed")
          .length,
      );
      setPendingTasks(
        filtered.filter((task) => task.status.toLowerCase() === "pending")
          .length,
      );
    }
  }, [maintenanceTasks, searchQuery, statusFilter, staffFilter, dateRange]);

  const formatDate = (date: Date) => {
    return format(new Date(date), "MMM d, yyyy");
  };

  const formatTime = (date: Date) => {
    return format(new Date(date), "h:mm a");
  };

  const formatDateTime = (date: Date) => {
    return format(new Date(date), "MMM d, yyyy h:mm a");
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "in progress":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "cancelled":
      case "canceled":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setStaffFilter("all");
    setDateRange({
      from: addDays(new Date(), -30),
      to: addDays(new Date(), 30),
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTask = () => {
    setIsEditMode(false);
    setFormData({
      id: 0,
      name: "",
      description: "",
      assignedStaff: "",
      startTime: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      endTime: format(addDays(new Date(), 1), "yyyy-MM-dd'T'HH:mm"),
      status: "pending",
    });
    setIsDialogOpen(true);
  };

  const handleEditTask = (task: any) => {
    setIsEditMode(true);
    setCurrentTask(task);
    setFormData({
      id: task.id,
      name: task.name,
      description: task.description,
      assignedStaff: task.assignedStaff,
      startTime: format(new Date(task.startTime), "yyyy-MM-dd'T'HH:mm"),
      endTime: format(new Date(task.endTime), "yyyy-MM-dd'T'HH:mm"),
      status: task.status,
    });
    setIsDialogOpen(true);
  };

  const handleDeleteTask = async (taskId: number) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        // This would be replaced with your actual delete function using Tauri
        // await invoke("delete_maintenance_task", { id: taskId });
        ToastUtils.success({
          description: "Task deleted successfully",
        });
        refetch();
      } catch (error) {
        ToastUtils.error({
          description: String(error),
        });
      }
    }
  };

  const handleSubmit = async () => {
    try {
      // Validate form data
      if (
        !formData.name ||
        !formData.assignedStaff ||
        !formData.startTime ||
        !formData.endTime
      ) {
        ToastUtils.error({
          description: "Please fill in all required fields",
        });
        return;
      }

      // This would be replaced with your actual save function using Tauri
      // const payload = {
      //   ...formData,
      //   startTime: new Date(formData.startTime),
      //   endTime: new Date(formData.endTime)
      // };
      //
      // if (isEditMode) {
      //   await invoke("update_maintenance_task", payload);
      // } else {
      //   await invoke("create_maintenance_task", payload);
      // }

      ToastUtils.success({
        description: `Task ${isEditMode ? "updated" : "created"} successfully`,
      });

      setIsDialogOpen(false);
      refetch();
    } catch (error) {
      ToastUtils.error({
        description: String(error),
      });
    }
  };

  return (
    <>
      <CooNavbar />
      <div className="container mx-auto py-8">
        <div className="flex flex-col gap-6 mt-20">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Maintenance Tasks
            </h1>
            <p className="text-muted-foreground">
              Manage and track all maintenance tasks
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalTasks}</div>
                <p className="text-xs text-muted-foreground">
                  For the selected period
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Completed Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedTasks}</div>
                <p className="text-xs text-muted-foreground">
                  {completedTasks > 0
                    ? `${Math.round((completedTasks / totalTasks) * 100)}% completion rate`
                    : "No completed tasks"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingTasks}</div>
                <p className="text-xs text-muted-foreground">
                  Requiring attention
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name, description, or staff..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="w-full md:w-[200px] space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full md:w-[200px] space-y-2">
              <Label htmlFor="staff">Assigned Staff</Label>
              <Select value={staffFilter} onValueChange={setStaffFilter}>
                <SelectTrigger id="staff">
                  <SelectValue placeholder="Select staff" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Staff</SelectItem>
                  {uniqueStaff.map((staff) => (
                    <SelectItem key={staff} value={staff}>
                      {staff}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full md:w-auto space-y-2">
              <Label>Date Range</Label>
              <DatePickerWithRange
                dateRange={dateRange}
                setDateRange={setDateRange}
              />
            </div>

            <Button
              variant="outline"
              className="mt-2 md:mt-0"
              onClick={resetFilters}
            >
              <Filter className="mr-2 h-4 w-4" />
              Reset Filters
            </Button>

            <Button className="mt-2 md:mt-0" onClick={handleAddTask}>
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Assigned Staff</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>End Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      Loading tasks...
                    </TableCell>
                  </TableRow>
                ) : !filteredTasks || filteredTasks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No tasks found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">{task.id}</TableCell>
                      <TableCell>{task.name}</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {task.description}
                      </TableCell>
                      <TableCell>{task.assignedStaff}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="flex items-center">
                            <Calendar className="mr-1 h-3 w-3" />
                            {formatDate(task.startTime)}
                          </span>
                          <span className="flex items-center text-xs text-muted-foreground">
                            <Clock className="mr-1 h-3 w-3" />
                            {formatTime(task.startTime)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="flex items-center">
                            <Calendar className="mr-1 h-3 w-3" />
                            {formatDate(task.endTime)}
                          </span>
                          <span className="flex items-center text-xs text-muted-foreground">
                            <Clock className="mr-1 h-3 w-3" />
                            {formatTime(task.endTime)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeClass(task.status)}>
                          {task.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditTask(task)}
                            className="h-8 w-8"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteTask(task.id)}
                            className="h-8 w-8 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Add/Edit Task Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Edit Task" : "Add New Task"}
            </DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Update the details of the maintenance task."
                : "Fill in the details to create a new maintenance task."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Task Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter task name"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="assignedStaff">Assigned Staff</Label>
                <Input
                  id="assignedStaff"
                  name="assignedStaff"
                  value={formData.assignedStaff}
                  onChange={handleInputChange}
                  placeholder="Enter staff name"
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter task description"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  name="startTime"
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  name="endTime"
                  type="datetime-local"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {isEditMode ? "Update Task" : "Create Task"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
