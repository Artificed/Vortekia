import { ToastUtils } from "@/components/utils/toast-helper";
import Store from "@/lib/interfaces/entities/store";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

export function useGetStores() {
  const {
    data: stores,
    isLoading,
    isError,
    refetch,
  } = useQuery<Store[], unknown>({
    queryKey: ["stores"],
    queryFn: async () => {
      try {
        const result = await invoke<Store[]>("get_all_stores");
        return result;
      } catch (error) {
        ToastUtils.error({
          description: String(error),
        });
        throw error;
      }
    },
  });

  return { stores, isLoading, isError, refetch };
}
