import { ToastUtils } from "@/components/utils/toast-helper";
import RestaurantTransaction from "@/lib/interfaces/entities/restaurant-transaction";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

export function useGetRestaurantTransactionsByRestaurant(restaurantId: string) {
  const {
    data: restaurantTransactions,
    isLoading,
    isError,
    refetch,
  } = useQuery<RestaurantTransaction[], unknown>({
    queryKey: ["restaurantTransactions", restaurantId],
    queryFn: async () => {
      try {
        const result = await invoke<RestaurantTransaction[]>(
          "get_restaurant_transactions_by_restaurant",
          { restaurantId },
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
