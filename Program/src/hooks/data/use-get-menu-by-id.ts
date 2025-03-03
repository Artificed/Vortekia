import { ToastUtils } from "@/components/utils/toast-helper";
import Menu from "@/lib/interfaces/entities/menu";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

export function useGetMenuById(menuId: string) {
  const {
    data: menu,
    isLoading,
    isError,
    refetch,
  } = useQuery<Menu, unknown>({
    queryKey: ["menu", menuId],
    queryFn: async () => {
      try {
        const result = await invoke<Menu>("find_menu_by_id", { id: menuId });
        return result;
      } catch (error) {
        ToastUtils.error({
          description: String(error),
        });
        throw error;
      }
    },
  });

  return { menu, isLoading, isError, refetch };
}
