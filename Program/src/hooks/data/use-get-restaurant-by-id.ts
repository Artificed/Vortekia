import { ToastUtils } from "@/components/utils/toast-helper";
import Restaurant from "@/lib/interfaces/entities/restaurant";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

export function useGetRestaurantById(restaurantId: string) {
  const {
    data: restaurant,
    isLoading,
    isError,
    refetch,
  } = useQuery<Restaurant, unknown>({
    queryKey: ["restaurant", restaurantId],
    queryFn: async () => {
      try {
        const result = await invoke<Restaurant>("get_restaurant_by_id", {
          id: restaurantId,
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

  return { restaurant, isLoading, isError, refetch };
}
