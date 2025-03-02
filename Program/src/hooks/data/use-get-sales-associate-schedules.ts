import { ToastUtils } from "@/components/utils/toast-helper";
import StaffWithSchedule from "@/lib/interfaces/viewmodels/staff-with-schedule";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

export function useGetSalesAssociateSchedules() {
  const {
    data: salesAssociateSchedules,
    isLoading,
    isError,
    refetch,
  } = useQuery<StaffWithSchedule[], unknown>({
    queryKey: ["salesAssociateSchedules"],
    queryFn: async () => {
      try {
        const result = await invoke<StaffWithSchedule[]>(
          "get_all_sales_associate_schedules",
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

  return { salesAssociateSchedules, isLoading, isError, refetch };
}
