import { ToastUtils } from "@/components/utils/toast-helper";
import Restaurant from "@/lib/interfaces/entities/restaurant";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

export function useGetStaffAssignedRestaurant(staffId: string) {
  const {
    data: assignedRestaurant,
    isLoading,
    isError,
    refetch,
  } = useQuery<Restaurant, unknown>({
    queryKey: ["assignedRestaurant", staffId],
    queryFn: async () => {
      try {
        const result = await invoke<Restaurant>(
          "get_staff_assigned_restaurant",
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

  return { assignedRestaurant, isLoading, isError, refetch };
}
