import MaintenanceManagerNavbar from "@/components/navbars/maintenance-manager-navbar";
import { useGetAllMaintenanceTasks } from "@/hooks/data/use-get-all-maintenance-tasks";
import { ToastUtils } from "@/components/utils/toast-helper";
import type MaintenanceTask from "@/lib/interfaces/entities/maintenance-task";
import { MaintenanceTaskTable } from "@/components/partials/maintenance-manager/maintenance-tasks-table";
import MaintenanceTaskModal from "@/components/modals/maintenance-task-modal";

export default function MaintenanceManagerDashboard() {
  const { maintenanceTasks, isLoading, isError, refetch } =
    useGetAllMaintenanceTasks();

  const handleStatusChange = (task: MaintenanceTask, newStatus: string) => {
    ToastUtils.success({
      title: "Status Updated",
      description: `Task "${task.name}" status changed to ${newStatus}`,
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <MaintenanceManagerNavbar />

      <div className="flex flex-col min-h-screen items-center">
        <main className="flex-1 container mx-auto items-center py-6 px-4 mt-24">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">
              Maintenance Manager Dashboard
            </h1>
            <MaintenanceTaskModal />
          </div>

          <div className="grid gap-6">
            <MaintenanceTaskTable
              tasks={maintenanceTasks}
              isLoading={isLoading}
              isError={isError}
              onRefresh={refetch}
              onStatusChange={handleStatusChange}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
