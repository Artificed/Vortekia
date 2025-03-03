import { ToastUtils } from "@/components/utils/toast-helper";
import StoreDeletionProposal from "@/lib/interfaces/entities/store-deletion-proposal";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

export function useGetStoreDeletionProposals() {
  const {
    data: storeDeletionProposals,
    isLoading,
    isError,
    refetch,
  } = useQuery<StoreDeletionProposal[], unknown>({
    queryKey: ["storeDeletionProposals"],
    queryFn: async () => {
      try {
        const result = await invoke<StoreDeletionProposal[]>(
          "get_all_store_deletion_proposals",
        );
        console.log(result);
        return result;
      } catch (error) {
        ToastUtils.error({
          description: String(error),
        });
        throw error;
      }
    },
  });

  return { storeDeletionProposals, isLoading, isError, refetch };
}
