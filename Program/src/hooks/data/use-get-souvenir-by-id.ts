import { ToastUtils } from "@/components/utils/toast-helper";
import Souvenir from "@/lib/interfaces/entities/souvenir";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

export function useGetSouvenirById(souvenirId: string) {
  const {
    data: souvenir,
    isLoading,
    isError,
    refetch,
  } = useQuery<Souvenir, unknown>({
    queryKey: ["souvenir", souvenirId],
    queryFn: async () => {
      try {
        const result = await invoke<Souvenir>("find_souvenir_by_id", {
          id: souvenirId,
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

  return { souvenir, isLoading, isError, refetch };
}
