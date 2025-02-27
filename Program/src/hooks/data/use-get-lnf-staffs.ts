import { ToastUtils } from "@/components/utils/toast-helper";
import Staff from "@/lib/interfaces/entities/staff";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

export function useGetLnfStaffs() {
  const {
    data: lnfStaffs,
    isLoading,
    isError,
    refetch,
  } = useQuery<Staff[], unknown>({
    queryKey: ["lnfStaffs"],
    queryFn: async () => {
      try {
        const result = await invoke<Staff[]>("get_lnf_staffs");
        return result;
      } catch (error) {
        ToastUtils.error({
          description: String(error),
        });
        throw error;
      }
    },
  });

  return { lnfStaffs, isLoading, isError, refetch };
}
