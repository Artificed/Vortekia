import { ToastUtils } from "@/components/utils/toast-helper";
import Restaurant from "@/lib/interfaces/entities/restaurant";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

export function useGetRestaurants() {
  const {
    data: restaurants,
    isLoading,
    isError,
    refetch,
  } = useQuery<Restaurant[], unknown>({
    queryKey: ["restaurants"],
    queryFn: async () => {
      try {
        const result = await invoke<Restaurant[]>("get_all_restaurants");
        return result;
      } catch (error) {
        ToastUtils.error({
          description: String(error),
        });
        throw error;
      }
    },
  });

  return { restaurants, isLoading, isError, refetch };
}
