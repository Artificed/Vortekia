import { ToastUtils } from "@/components/utils/toast-helper";
import Souvenir from "@/lib/interfaces/entities/souvenir";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

export function useGetSouvenirs() {
  const {
    data: souvenirs,
    isLoading,
    isError,
    refetch,
  } = useQuery<Souvenir[], unknown>({
    queryKey: ["souvenirs"],
    queryFn: async () => {
      try {
        const result = await invoke<Souvenir[]>("get_all_souvenirs");
        return result;
      } catch (error) {
        ToastUtils.error({
          description: String(error),
        });
        throw error;
      }
    },
  });

  return { souvenirs, isLoading, isError, refetch };
}
