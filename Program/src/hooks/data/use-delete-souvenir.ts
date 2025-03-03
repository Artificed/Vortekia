import { ToastUtils } from "@/components/utils/toast-helper";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

export function useDeleteSouvenir() {
  const queryClient = useQueryClient();

  const { mutate: deleteSouvenir, isPending } = useMutation<
    void,
    unknown,
    string
  >({
    mutationFn: async (souvenirId: string) => {
      await invoke("delete_souvenir", { souvenirId: souvenirId });
    },
    onSuccess: () => {
      ToastUtils.success({ description: "Souvenir deleted successfully." });
      queryClient.invalidateQueries({ queryKey: ["souvenir"] });
      queryClient.invalidateQueries({ queryKey: ["souvenirs"] });
    },
    onError: (error) => {
      ToastUtils.error({
        description: `Failed to delete souvenir: ${String(error)}`,
      });
    },
  });

  return { deleteSouvenir, isPending };
}
