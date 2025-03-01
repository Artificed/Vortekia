import { ToastUtils } from "@/components/utils/toast-helper";
import RideWithStaff from "@/lib/interfaces/viewmodels/ride-with-staff";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

export function useGetRideWithStaff() {
  const {
    data: ridesWithStaff,
    isLoading,
    isError,
    refetch,
  } = useQuery<RideWithStaff[], unknown>({
    queryKey: ["ridesWithStaff"],
    queryFn: async () => {
      try {
        const result = await invoke<RideWithStaff[]>("get_rides_with_staff");
        return result;
      } catch (error) {
        ToastUtils.error({
          description: String(error),
        });
        throw error;
      }
    },
  });

  return { ridesWithStaff, isLoading, isError, refetch };
}
