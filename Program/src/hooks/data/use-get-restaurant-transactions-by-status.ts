import { ToastUtils } from "@/components/utils/toast-helper";
import RestaurantTransaction from "@/lib/interfaces/entities/restaurant-transaction";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

export function useGetRestaurantTransactionsByStatus(
  restaurantId: string,
  status: string,
) {
  const {
    data: restaurantTransactions,
    isLoading,
    isError,
    refetch,
  } = useQuery<RestaurantTransaction[], unknown>({
    queryKey: ["restaurantTransactions", restaurantId, status],
    queryFn: async () => {
      console.log(restaurantId);
      try {
        const result = await invoke<RestaurantTransaction[]>(
          "get_restaurant_transactions_by_status",
          { id: restaurantId, status },
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
