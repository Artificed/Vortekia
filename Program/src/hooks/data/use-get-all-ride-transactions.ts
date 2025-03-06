import { ToastUtils } from "@/components/utils/toast-helper";
import RideTransaction from "@/lib/interfaces/entities/ride-transaction";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

export function useGetAllRideTransactions() {
  const {
    data: rideTransactions,
    isLoading,
    isError,
    refetch,
  } = useQuery<RideTransaction[], unknown>({
    queryKey: ["rideTransactions"],
    queryFn: async () => {
      try {
        const result = await invoke<RideTransaction[]>(
          "get_all_ride_transactions",
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

  return { rideTransactions, isLoading, isError, refetch };
}
