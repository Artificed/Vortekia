import { ToastUtils } from "@/components/utils/toast-helper";
import Souvenir from "@/lib/interfaces/entities/souvenir";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

export function useGetStoreSouvenirs(storeId: string) {
  const {
    data: storeSouvenirs,
    isLoading,
    isError,
    refetch,
  } = useQuery<Souvenir[], unknown>({
    queryKey: ["souvenirs", storeId],
    queryFn: async () => {
      try {
        const result = await invoke<Souvenir[]>("get_souvenirs_by_store_id", {
          storeId,
        });
        return result;
      } catch (error) {
        ToastUtils.error({
          description: String(error),
        });
        throw error;
      }
    },
  });

  return { storeSouvenirs, isLoading, isError, refetch };
}
