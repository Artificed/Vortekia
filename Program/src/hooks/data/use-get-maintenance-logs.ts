import { ToastUtils } from "@/components/utils/toast-helper";
import MaintenanceLog from "@/lib/interfaces/entities/maintenance-log";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

export function useGetMaintenanceLogs() {
  const {
    data: maintenanceLogs,
    isLoading,
    isError,
    refetch,
  } = useQuery<MaintenanceLog[], unknown>({
    queryKey: ["maintenanceLogs"],
    queryFn: async () => {
      try {
        const result = await invoke<MaintenanceLog[]>(
          "get_all_maintenance_logs",
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

  return { maintenanceLogs, isLoading, isError, refetch };
}
