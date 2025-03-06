import { ToastUtils } from "@/components/utils/toast-helper";
import StoreTransaction from "@/lib/interfaces/entities/store-transaction";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

export function useGetAllStoreTransactions() {
  const {
    data: storeTransactions,
    isLoading,
    isError,
    refetch,
  } = useQuery<StoreTransaction[], unknown>({
    queryKey: ["storeTransactions"],
    queryFn: async () => {
      try {
        const result = await invoke<StoreTransaction[]>(
          "get_all_store_transactions",
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

  return { storeTransactions, isLoading, isError, refetch };
}
