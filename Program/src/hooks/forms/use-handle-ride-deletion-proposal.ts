import { useGetRideDeletionProposals } from "@/hooks/data/use-get-ride-deletion-proposals";
import { invoke } from "@tauri-apps/api/core";
import { ToastUtils } from "@/components/utils/toast-helper";
import { QueryClient } from "@tanstack/react-query";

export function useHandleRideDeletionProposal(queryClient: QueryClient) {
  const { rideDeletionProposals } = useGetRideDeletionProposals();

  const pendingDeletionProposals =
    rideDeletionProposals?.filter((p) => p.done === 0) || [];
  const completedDeletionProposals =
    rideDeletionProposals?.filter((p) => p.done === 1) || [];

  const handleDeletionProposal = async (id: string, approve: number) => {
    try {
      await invoke("update_ride_deletion_proposal_approval", { id, approve });
      queryClient.invalidateQueries({ queryKey: ["rideDeletionProposals"] });
      ToastUtils.success({
        description: "Successfully managed deletion proposal!",
      });
    } catch (error) {
      ToastUtils.error({ description: String(error) });
    }
  };

  return {
    rideDeletionProposals,
    pendingDeletionProposals,
    completedDeletionProposals,
    handleDeletionProposal,
  };
}
