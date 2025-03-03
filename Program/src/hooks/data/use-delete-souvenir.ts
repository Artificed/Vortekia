import { ToastUtils } from "@/components/utils/toast-helper";
import { useMutation } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

export function useDeleteSouvenir() {
  const { mutate: deleteSouvenir, isPending } = useMutation<
    void,
    unknown,
    string
  >({
    mutationFn: async (souvenirId: string) => {
      await invoke("delete_souvenir", { souvenir_id: souvenirId });
    },
    onSuccess: () => {
      ToastUtils.success({ description: "Souvenir deleted successfully." });
    },
    onError: () => {
      ToastUtils.error({ description: "Failed to delete souvenir." });
    },
  });

  return { deleteSouvenir, isPending };
}
