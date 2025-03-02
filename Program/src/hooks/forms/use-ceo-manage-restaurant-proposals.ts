import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { ToastUtils } from "@/components/utils/toast-helper";
import RestaurantProposal from "@/lib/interfaces/entities/restaurant-proposal";
import { useGetCfoApprovedRestaurantProposals } from "../data/use-get-cfo-approved-restaurant-proposals";

export function useCeoManageRestaurantProposals() {
  const { restaurantProposals, refetch } =
    useGetCfoApprovedRestaurantProposals();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleApprove = async (proposal: RestaurantProposal) => {
    await updateProposal(proposal, 1);
  };

  const handleReject = async (proposal: RestaurantProposal) => {
    await updateProposal(proposal, 0);
  };

  const updateProposal = async (
    proposal: RestaurantProposal,
    approved: number,
  ) => {
    setIsLoading(true);
    try {
      await invoke("update_new_restaurant_proposal_ceo_approval", {
        id: proposal.id,
        approve: approved,
      });
      ToastUtils.success({
        description: `Restaurant proposal ${
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

  const pendingProposals =
    restaurantProposals?.filter(
      (p) => p.ceoDone === 0 && p.cfoApproved === 1,
    ) || [];
  const processedProposals =
    restaurantProposals?.filter(
      (p) => p.ceoDone === 1 && p.cfoApproved === 1,
    ) || [];

  return {
    pendingProposals,
    processedProposals,
    handleApprove,
    handleReject,
    updateProposal,
    isLoading,
  };
}
