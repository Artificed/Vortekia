import { ToastUtils } from "@/components/utils/toast-helper";
import Store from "@/lib/interfaces/entities/store";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

export function useGetStoreById(storeId: string) {
  const {
    data: store,
    isLoading,
    isError,
    refetch,
  } = useQuery<Store, unknown>({
    queryKey: ["store", storeId],
    queryFn: async () => {
      try {
        const result = await invoke<Store>("get_store_by_id", { id: storeId });
        return result;
      } catch (error) {
        ToastUtils.error({
          description: String(error),
        });
        throw error;
      }
    },
  });

  return { store, isLoading, isError, refetch };
}
