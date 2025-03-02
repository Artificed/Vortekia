import { ToastUtils } from "@/components/utils/toast-helper";
import Staff from "@/lib/interfaces/entities/staff";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

export function useGetSalesAssociates() {
  const {
    data: salesAssociates,
    isLoading,
    isError,
    refetch,
  } = useQuery<Staff[], unknown>({
    queryKey: ["salesAssociates"],
    queryFn: async () => {
      try {
        const result = await invoke<Staff[]>("get_sales_associates");
        return result;
      } catch (error) {
        ToastUtils.error({
          description: String(error),
        });
        throw error;
      }
    },
  });

  return { salesAssociates, isLoading, isError, refetch };
}
