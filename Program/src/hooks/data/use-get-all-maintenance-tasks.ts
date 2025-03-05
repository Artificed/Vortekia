import { ToastUtils } from "@/components/utils/toast-helper";
import MaintenanceTask from "@/lib/interfaces/entities/maintenance-task";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

export function useGetAllMaintenanceTasks() {
  const {
    data: maintenanceTasks,
    isLoading,
    isError,
    refetch,
  } = useQuery<MaintenanceTask[], unknown>({
    queryKey: ["maintenanceTasks"],
    queryFn: async () => {
      try {
        const result = await invoke<MaintenanceTask[]>(
          "get_all_maintenance_tasks",
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

  return { maintenanceTasks, isLoading, isError, refetch };
}
