import { ToastUtils } from "@/components/utils/toast-helper";
import StoreTransaction from "@/lib/interfaces/entities/store-transaction";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

export function useGetCurrentUserStoreTransactions() {
  const {
    data: currentUserStoreTransactions,
    isLoading,
    isError,
    refetch,
  } = useQuery<StoreTransaction[], unknown>({
    queryKey: ["currentUserStoreTransactions"],
    queryFn: async () => {
      try {
        const result = await invoke<[]>("get_current_user_store_transactions");
        return result;
      } catch (error) {
        ToastUtils.error({
          description: String(error),
        });
        throw error;
      }
    },
  });

  return { currentUserStoreTransactions, isLoading, isError, refetch };
}
