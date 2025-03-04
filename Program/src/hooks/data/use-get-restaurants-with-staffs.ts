import { ToastUtils } from "@/components/utils/toast-helper";
import RestaurantWithStaffs from "@/lib/interfaces/viewmodels/restaurant-with-staffs";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

export function useGetRestaurantsWithStaffs() {
  const {
    data: restaurantsWithStaffs,
    isLoading,
    isError,
    refetch,
  } = useQuery<RestaurantWithStaffs[], unknown>({
    queryKey: ["restaurantsWithStaffSchedules"],
    queryFn: async () => {
      try {
        const result = await invoke<RestaurantWithStaffs[]>(
          "get_restaurants_with_staffs",
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

  return { restaurantsWithStaffs, isLoading, isError, refetch };
}
