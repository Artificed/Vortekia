import { ToastUtils } from "@/components/utils/toast-helper";
import Staff from "@/lib/interfaces/entities/staff";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

export function useGetRestaurantStaffs() {
  const {
    data: restaurantStaffs,
    isLoading: isRestaurantStaffsLoading,
    isError,
    refetch,
  } = useQuery<Staff[], unknown>({
    queryKey: ["restaurantStaffs"],
    queryFn: async () => {
      try {
        const result = await invoke<Staff[]>("get_restaurant_staffs");
        return result;
      } catch (error) {
        ToastUtils.error({
          description: String(error),
        });
        throw error;
      }
    },
  });

  return { restaurantStaffs, isRestaurantStaffsLoading, isError, refetch };
}
