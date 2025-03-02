import { ToastUtils } from "@/components/utils/toast-helper";
import NewStoreProposal from "@/lib/interfaces/entities/new-store-proposal";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

export function useGetNewStoreProposals() {
  const {
    data: newStoreProposals,
    isLoading,
    isError,
    refetch,
  } = useQuery<NewStoreProposal[], unknown>({
    queryKey: ["newStoreProposals"],
    queryFn: async () => {
      try {
        const result = await invoke<NewStoreProposal[]>(
          "get_all_new_store_proposals",
        );
        return result;
      } catch (error) {
        ToastUtils.error({
          description: String(error),
        });
        throw error;
      }
    },
  });

  return { newStoreProposals, isLoading, isError, refetch };
}
