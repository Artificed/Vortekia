import { ToastUtils } from "@/components/utils/toast-helper";
import LnfLog from "@/lib/interfaces/entities/lnf-log";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

export function useGetLnfLogs() {
  const {
    data: lnfLogs,
    isLoading,
    isError,
    refetch,
  } = useQuery<LnfLog[], unknown>({
    queryKey: ["lnfLogs"],
    queryFn: async () => {
      try {
        const result = await invoke<LnfLog[]>("get_lnf_logs");
        console.log(result);
        return result;
      } catch (error) {
        ToastUtils.error({
          description: String(error),
        });
        throw error;
      }
    },
  });

  return { lnfLogs, isLoading, isError, refetch };
}
