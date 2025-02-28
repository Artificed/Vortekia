import { ToastUtils } from "@/components/utils/toast-helper";
import Staff from "@/lib/interfaces/entities/staff";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

export function useGetRideStaffs() {
  const {
    data: rideStaffs,
    isLoading,
    isError,
    refetch,
  } = useQuery<Staff[], unknown>({
    queryKey: ["rideStaffs"],
    queryFn: async () => {
      try {
        const result = await invoke<Staff[]>("get_ride_staffs");
        return result;
      } catch (error) {
        ToastUtils.error({
          description: String(error),
        });
        throw error;
      }
    },
  });

  return { rideStaffs, isLoading, isError, refetch };
}
