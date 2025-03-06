import { ToastUtils } from "@/components/utils/toast-helper";
import Store from "@/lib/interfaces/entities/store";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

export function useGetStaffAssignedStore(staffId: string) {
  const {
    data: assignedStore,
    isLoading,
    isError,
    refetch,
  } = useQuery<Store, unknown>({
    queryKey: ["assignedStore", staffId],
    queryFn: async () => {
      try {
        const result = await invoke<Store>("get_staff_assigned_store", {
          staffId,
        });
        return result;
      } catch (error) {
        ToastUtils.error({
          description: String(error),
        });
        throw error;
      }
    },
  });

  return { assignedStore, isLoading, isError, refetch };
}
