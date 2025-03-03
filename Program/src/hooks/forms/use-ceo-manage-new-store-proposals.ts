import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { ToastUtils } from "@/components/utils/toast-helper";
import { useGetNewStoreProposals } from "../data/use-get-new-store-proposals";
import NewStoreProposal from "@/lib/interfaces/entities/new-store-proposal";

export function useCeoManageNewStoreProposals() {
  const { newStoreProposals, refetch } = useGetNewStoreProposals();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const updateProposal = async (
    proposal: NewStoreProposal,
    approved: number,
    openingTime?: string,
    closingTime?: string,
  ) => {
    setIsLoading(true);

    try {
      await invoke("update_new_store_proposal_approval", {
        id: proposal.id,
        approve: approved,
        openingTime: openingTime + ":00",
        closingTime: closingTime + ":00",
      });
      ToastUtils.success({
        description: `Store proposal ${approved ? "Approved" : "Rejected"} successfully!`,
      });
      refetch();
    } catch (error) {
      ToastUtils.error({ description: String(error) });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (proposal: NewStoreProposal) => {
    await updateProposal(proposal, 0);
  };

  const pendingProposals = newStoreProposals?.filter((p) => p.done === 0) || [];
  const processedProposals =
    newStoreProposals?.filter((p) => p.done === 1) || [];

  return {
    pendingProposals,
    processedProposals,
    updateProposal,
    handleReject,
    isLoading,
  };
}
