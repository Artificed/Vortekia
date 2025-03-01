import { useGetNewRideProposals } from "@/hooks/data/use-get-new-ride-proposals";
import { invoke } from "@tauri-apps/api/core";
import { ToastUtils } from "@/components/utils/toast-helper";
import { QueryClient } from "@tanstack/react-query";

export function useHandleNewRideProposal(queryClient: QueryClient) {
  const { newRideProposals } = useGetNewRideProposals();

  const pendingNewRideProposals =
    newRideProposals?.filter((p) => p.done === 0) || [];
  const completedNewRideProposals =
    newRideProposals?.filter((p) => p.done === 1) || [];

  const handleNewRideProposal = async (
    id: string,
    approve: number,
    openingTime?: string,
    closingTime?: string,
  ) => {
    try {
      if (approve === 1 && openingTime && closingTime) {
        await invoke("update_new_ride_proposal_approval", {
          id,
          approve,
          openingTime: openingTime + ":00",
          closingTime: closingTime + ":00",
        });
      } else {
        ToastUtils.error({
          description: "Please set the opening and closing times!",
        });
      }

      queryClient.invalidateQueries({ queryKey: ["newRideProposals"] });
      ToastUtils.success({
        description: "Successfully managed new ride proposal!",
      });
    } catch (error) {
      ToastUtils.error({ description: String(error) });
    }
  };

  return {
    newRideProposals,
    pendingNewRideProposals,
    completedNewRideProposals,
    handleNewRideProposal,
  };
}
