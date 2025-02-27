import { ToastUtils } from "@/components/utils/toast-helper";
import Customer from "@/lib/interfaces/entities/customer";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

export function useGetCustomers() {
  const {
    data: customers,
    isLoading,
    isError,
    refetch,
  } = useQuery<Customer[], unknown>({
    queryKey: ["customers"],
    queryFn: async () => {
      try {
        const result = await invoke<Customer[]>("get_all_customers");
        return result;
      } catch (error) {
        ToastUtils.error({
          description: String(error),
        });
        throw error;
      }
    },
  });

  return { customers, isLoading, isError, refetch };
}
