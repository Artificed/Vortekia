import { ToastUtils } from "@/components/utils/toast-helper";
import Ride from "@/lib/interfaces/entities/ride";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

export function useGetRides() {
  const {
    data: rides,
    isLoading,
    isError,
    refetch,
  } = useQuery<Ride[], unknown>({
    queryKey: ["rides"],
    queryFn: async () => {
      try {
        const result = await invoke<Ride[]>("get_all_rides");
        return result;
      } catch (error) {
        ToastUtils.error({
          description: String(error),
        });
        throw error;
      }
    },
  });

  return { rides, isLoading, isError, refetch };
}
