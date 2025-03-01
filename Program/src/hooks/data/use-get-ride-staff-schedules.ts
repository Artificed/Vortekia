import { ToastUtils } from "@/components/utils/toast-helper";
import StaffWithSchedule from "@/lib/interfaces/viewmodels/staff-with-schedule";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

export function useGetRideStaffSchedules() {
  const {
    data: rideStaffSchedules,
    isLoading,
    isError,
    refetch,
  } = useQuery<StaffWithSchedule[], unknown>({
    queryKey: ["rideStaffSchedules"],
    queryFn: async () => {
      try {
        const result = await invoke<StaffWithSchedule[]>(
          "get_all_ride_staff_schedules",
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

  return { rideStaffSchedules, isLoading, isError, refetch };
}
