import { ToastUtils } from "@/components/utils/toast-helper";
import RestaurantWithStaffSchedule from "@/lib/interfaces/viewmodels/restaurant-with-staff-schedule";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

export function useGetRestaurantsWithStaffSchedules() {
  const {
    data: restaurantsWithStaffSchedules,
    isLoading,
    isError,
    refetch,
  } = useQuery<RestaurantWithStaffSchedule[], unknown>({
    queryKey: ["restaurantsWithStaffSchedules"],
    queryFn: async () => {
      try {
        const result = await invoke<RestaurantWithStaffSchedule[]>(
          "get_restaurants_with_staff_schedules",
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

  return { restaurantsWithStaffSchedules, isLoading, isError, refetch };
}
