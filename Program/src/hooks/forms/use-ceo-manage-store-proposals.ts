import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { ToastUtils } from "@/components/utils/toast-helper";
import { useGetNewStoreProposals } from "../data/use-get-new-store-proposals";
import NewStoreProposal from "@/lib/interfaces/entities/new-store-proposal";

export function useCeoManageNewStoreProposals() {
  const { newStoreProposals, refetch } = useGetNewStoreProposals();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleApprove = async (proposal: NewStoreProposal) => {
    await updateProposal(proposal, 1);
  };

  const handleReject = async (proposal: NewStoreProposal) => {
    await updateProposal(proposal, 0);
  };

  const updateProposal = async (
    proposal: NewStoreProposal,
    approved: number,
  ) => {
    setIsLoading(true);
    try {
      await invoke("update_new_store_proposal", {
        id: proposal.id,
        approve: approved,
      });
      ToastUtils.success({
        description: `Store proposal ${
          approved ? "Approved" : "rejected"
        } successfully!`,
      });
      refetch();
    } catch (error) {
      ToastUtils.error({ description: String(error) });
    } finally {
      setIsLoading(false);
    }
  };

  const pendingProposals = newStoreProposals?.filter((p) => p.done === 0) || [];
  const processedProposals =
    newStoreProposals?.filter((p) => p.done === 1) || [];

  return {
    pendingProposals,
    processedProposals,
    handleApprove,
    handleReject,
    updateProposal,
    isLoading,
  };
}
