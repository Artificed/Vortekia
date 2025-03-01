import { ToastUtils } from "@/components/utils/toast-helper";
import RideDeletionProposal from "@/lib/interfaces/entities/ride-deletion-proposal";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

export function useGetRideDeletionProposals() {
  const {
    data: rideDeletionProposals,
    isLoading,
    isError,
    refetch,
  } = useQuery<RideDeletionProposal[], unknown>({
    queryKey: ["rideDeletionProposals"],
    queryFn: async () => {
      try {
        const result = await invoke<RideDeletionProposal[]>(
          "get_all_ride_deletion_proposals",
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

  return { rideDeletionProposals, isLoading, isError, refetch };
}
