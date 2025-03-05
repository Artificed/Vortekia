import { ToastUtils } from "@/components/utils/toast-helper";
import MaintenanceRequest from "@/lib/interfaces/entities/maintenance-request";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

export function useGetMaintenanceRequests() {
  const {
    data: maintenanceRequests,
    isLoading,
    isError,
    refetch,
  } = useQuery<MaintenanceRequest[], unknown>({
    queryKey: [],
    queryFn: async () => {
      try {
        const result = await invoke<MaintenanceRequest[]>(
          "get_all_maintenance_requests",
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

  return { maintenanceRequests, isLoading, isError, refetch };
}
