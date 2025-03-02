import { useState } from "react";
import { useGetRestaurantProposals } from "@/hooks/data/use-get-restaurant-proposals";
import { invoke } from "@tauri-apps/api/core";
import { ToastUtils } from "@/components/utils/toast-helper";
import RestaurantProposal from "@/lib/interfaces/entities/restaurant-proposal";

export function useCfoManageRestaurantProposals() {
  const { restaurantProposals, refetch } = useGetRestaurantProposals();
  const [selectedProposal, setSelectedProposal] =
    useState<RestaurantProposal | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleApprove = (proposal: RestaurantProposal) => {
    setSelectedProposal(proposal);
    setIsDialogOpen(true);
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
      await invoke("update_new_restaurant_proposal_cfo_approval", {
        id: proposal.id,
        approve: approved,
      });
      ToastUtils.success({
        description: `Restaurant proposal ${
          approved ? "approved and forwarded to CEO" : "rejected"
        } successfully!`,
      });
      refetch();
    } catch (error) {
      ToastUtils.error({ description: String(error) });
    } finally {
      setIsLoading(false);
      setIsDialogOpen(false);
    }
  };

  const pendingProposals =
    restaurantProposals?.filter((p) => p.cfoDone === 0) || [];
  const processedProposals =
    restaurantProposals?.filter((p) => p.cfoDone === 1) || [];

  return {
    pendingProposals,
    processedProposals,
    handleApprove,
    handleReject,
    isDialogOpen,
    setIsDialogOpen,
    selectedProposal,
    updateProposal,
    isLoading,
  };
}
