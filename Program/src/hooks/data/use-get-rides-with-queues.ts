import { ToastUtils } from "@/components/utils/toast-helper";
import RideWithQueue from "@/lib/interfaces/viewmodels/ride-with-queue";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

export function useGetRidesWithQueues() {
  const {
    data: ridesWithQueues,
    isLoading,
    isError,
    refetch,
  } = useQuery<RideWithQueue[], unknown>({
    queryKey: ["ridesWithQueues"],
    queryFn: async () => {
      try {
        const result = await invoke<RideWithQueue[]>(
          "get_all_rides_with_queues",
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

  return { ridesWithQueues, isLoading, isError, refetch };
}
