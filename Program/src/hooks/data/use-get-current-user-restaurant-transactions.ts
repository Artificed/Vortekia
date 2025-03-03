import { ToastUtils } from "@/components/utils/toast-helper";
import RestaurantTransaction from "@/lib/interfaces/entities/restaurant-transaction";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

export function useGetCurrentUserRestaurantTransactions() {
  const {
    data: currentUserRestaurantTransactions,
    isLoading,
    isError,
    refetch,
  } = useQuery<RestaurantTransaction[], unknown>({
    queryKey: ["currentUserRestaurantTransactions"],
    queryFn: async () => {
      try {
        const result = await invoke<[]>(
          "get_current_user_restaurant_transactions",
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

  return { currentUserRestaurantTransactions, isLoading, isError, refetch };
}
