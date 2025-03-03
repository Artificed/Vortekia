import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { ToastUtils } from "@/components/utils/toast-helper";
import StoreDeletionProposal from "@/lib/interfaces/entities/store-deletion-proposal";
import { useGetStoreDeletionProposals } from "../data/use-get-store-deletion-proposals";

export function useCeoManageStoreDeletionProposals() {
  const { storeDeletionProposals, refetch } = useGetStoreDeletionProposals();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const updateProposal = async (
    proposal: StoreDeletionProposal,
    approved: number,
  ) => {
    setIsLoading(true);

    try {
      console.log(proposal.id);
      console.log(approved);

      await invoke("update_store_deletion_proposal_approval", {
        id: proposal.id,
        approve: approved,
      });
      ToastUtils.success({
        description: `Store deletion proposal ${approved ? "Approved" : "Rejected"} successfully!`,
      });
      refetch();
    } catch (error) {
      ToastUtils.error({ description: String(error) });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (proposal: StoreDeletionProposal) => {
    await updateProposal(proposal, 0);
  };

  const pendingProposals =
    storeDeletionProposals?.filter((p) => p.done === 0) || [];
  const processedProposals =
    storeDeletionProposals?.filter((p) => p.done === 1) || [];

  return {
    pendingProposals,
    processedProposals,
    updateProposal,
    handleReject,
    isLoading,
  };
}
