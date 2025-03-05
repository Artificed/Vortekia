import { ToastUtils } from "@/components/utils/toast-helper";
import Staff from "@/lib/interfaces/entities/staff";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

export function useGetMaintenanceStaffs() {
  const {
    data: maintenanceStaffs,
    isLoading,
    isError,
    refetch,
  } = useQuery<Staff[], unknown>({
    queryKey: ["maintenanceStaffs"],
    queryFn: async () => {
      try {
        const result = await invoke<Staff[]>("get_maintenance_staffs");
        return result;
      } catch (error) {
        ToastUtils.error({
          description: String(error),
        });
        throw error;
      }
    },
  });

  return { maintenanceStaffs, isLoading, isError, refetch };
}
