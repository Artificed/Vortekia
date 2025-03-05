import MaintenanceStaffNavbar from "@/components/navbars/maintenance-staff-navbar";
import useAuth from "@/hooks/auth/use-auth";
import { useGetMaintenanceTasksByStaff } from "@/hooks/data/use-get-maintenance-tasks-by-staff";
import type MaintenanceTask from "@/lib/interfaces/entities/maintenance-task";
import type MaintenanceLog from "@/lib/interfaces/entities/maintenance-log";
import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MaintenanceTaskDetailModal } from "@/components/modals/maintenance-task-detail-modal";
import { MaintenanceTaskCard } from "@/components/partials/maintenance-staff/maintenance-task-card";

export default function MaintenanceStaffDashboard() {
  const auth = useAuth();
  const { staffMaintenanceTasks, isLoading, isError, refetch } =
    useGetMaintenanceTasksByStaff(auth?.user?.id || "");

  const [selectedTask, setSelectedTask] = useState<MaintenanceTask | null>(
    null,
  );
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceLog[]>([]);

  const fetchLogsForTask = async (taskId: string | number) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const mockLogs: MaintenanceLog[] = [
      {
        id: "log1",
        taskId: taskId.toString(),
        message:
          "Started working on the maintenance task. Identified the issue with the equipment.",
        createdAt: new Date(Date.now() - 86400000),
        approved: 1,
        done: 0,
      },
      {
        id: "log2",
        taskId: taskId.toString(),
        message:
          "Ordered replacement parts for the equipment. Expected delivery in 2 days.",
        createdAt: new Date(Date.now() - 43200000),
        approved: 1,
        done: 1,
      },
    ];

    setMaintenanceLogs(mockLogs);
  };

  const handleTaskClick = (task: MaintenanceTask) => {
    setSelectedTask(task);
    setIsDetailModalOpen(true);
    fetchLogsForTask(task.id);
  };

  const handleCloseModal = () => {
    setIsDetailModalOpen(false);
    setSelectedTask(null);
  };

  const handleLogSubmitted = () => {
    if (selectedTask) {
      fetchLogsForTask(selectedTask.id);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <MaintenanceStaffNavbar />
      <main className="flex-1 container mx-auto p-6 mt-28">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Maintenance Tasks</h1>
          <Button
            onClick={() => refetch()}
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
        ) : isError ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="text-red-500 mb-4 text-lg">
              Error loading maintenance tasks
            </div>
            <Button onClick={() => refetch()} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        ) : staffMaintenanceTasks && staffMaintenanceTasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {staffMaintenanceTasks.map((task) => (
              <MaintenanceTaskCard
                key={task.id}
                task={task}
                onClick={() => handleTaskClick(task)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center border rounded-md">
            <p className="text-muted-foreground mb-4">
              No maintenance tasks assigned to you
            </p>
            <Button onClick={() => refetch()} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        )}
      </main>

      <MaintenanceTaskDetailModal
        task={selectedTask}
        isOpen={isDetailModalOpen}
        onClose={handleCloseModal}
        logs={maintenanceLogs}
        onLogSubmitted={handleLogSubmitted}
      />
    </div>
  );
}
