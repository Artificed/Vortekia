import { ToastUtils } from "@/components/utils/toast-helper";
import Menu from "@/lib/interfaces/entities/menu";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

export function useGetMenus() {
  const {
    data: menus,
    isLoading,
    isError,
    refetch,
  } = useQuery<Menu[], unknown>({
    queryKey: ["menus"],
    queryFn: async () => {
      try {
        const result = await invoke<Menu[]>("get_all_menus");
        return result;
      } catch (error) {
        ToastUtils.error({
          description: String(error),
        });
        throw error;
      }
    },
  });

  return { menus, isLoading, isError, refetch };
}
