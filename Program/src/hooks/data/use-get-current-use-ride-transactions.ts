import { ToastUtils } from "@/components/utils/toast-helper";
import RideTransaction from "@/lib/interfaces/entities/ride-transaction";
import StoreTransaction from "@/lib/interfaces/entities/store-transaction";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

export function useGetCurrentUserRideTransactions() {
  const {
    data: currentUserRideTransactions,
    isLoading,
    isError,
    refetch,
  } = useQuery<RideTransaction[], unknown>({
    queryKey: ["currentUserRideTransactions"],
    queryFn: async () => {
      try {
        const result = await invoke<[]>("get_current_user_ride_transactions");
        return result;
      } catch (error) {
        ToastUtils.error({
          description: String(error),
        });
        throw error;
      }
    },
  });

  return { currentUserRideTransactions, isLoading, isError, refetch };
}
