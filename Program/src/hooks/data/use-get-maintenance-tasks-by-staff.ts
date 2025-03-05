import { ToastUtils } from "@/components/utils/toast-helper";
import MaintenanceTask from "@/lib/interfaces/entities/maintenance-task";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

export function useGetMaintenanceTasksByStaff(staffId: string) {
  const {
    data: staffMaintenanceTasks,
    isLoading,
    isError,
    refetch,
  } = useQuery<MaintenanceTask[], unknown>({
    queryKey: ["staffMaintenanceTasks", staffId],
    queryFn: async () => {
      try {
        const result = await invoke<MaintenanceTask[]>(
          "get_maintenance_task_by_staff",
          { staffId },
        );
        return result;
      } catch (error) {
        ToastUtils.error({
          description: String(error),
        });
        throw error;
      }
    },
  });

  return { staffMaintenanceTasks, isLoading, isError, refetch };
}
