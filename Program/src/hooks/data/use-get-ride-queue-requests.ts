import { ToastUtils } from "@/components/utils/toast-helper";
import QueueRequest from "@/lib/interfaces/entities/queue-request";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

export function useGetRideQueueRequests(rideId: string) {
  const {
    data: rideQueueRequests,
    isLoading,
    isError,
    refetch,
  } = useQuery<QueueRequest[], unknown>({
    queryKey: ["rideQueueRequests", rideId],
    queryFn: async () => {
      try {
        const result = await invoke<QueueRequest[]>(
          "get_queue_requests_by_ride",
          {
            rideId,
          },
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

  return { rideQueueRequests, isLoading, isError, refetch };
}
