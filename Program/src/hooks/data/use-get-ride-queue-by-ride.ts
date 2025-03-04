import { ToastUtils } from "@/components/utils/toast-helper";
import RideQueue from "@/lib/interfaces/entities/ride-queue";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

export function useGetRideQueueByRide(rideId: string) {
  const {
    data: rideQueue,
    isLoading,
    isError,
    refetch,
  } = useQuery<RideQueue[], unknown>({
    queryKey: ["rideQueue", rideId],
    queryFn: async () => {
      try {
        const result = await invoke<RideQueue[]>("get_ride_queues_by_ride", {
          rideId,
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

  return { rideQueue, isLoading, isError, refetch };
}
