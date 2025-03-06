import { ToastUtils } from "@/components/utils/toast-helper";
import RestaurantTransaction from "@/lib/interfaces/entities/restaurant-transaction";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

export function useGetRestaurantTransactions() {
  const {
    data: restaurantTransactions,
    isLoading,
    isError,
    refetch,
  } = useQuery<RestaurantTransaction[], unknown>({
    queryKey: ["restaurantTransactions"],
    queryFn: async () => {
      try {
        const result = await invoke<RestaurantTransaction[]>(
          "get_all_restaurant_transactions",
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

  return { restaurantTransactions, isLoading, isError, refetch };
}
