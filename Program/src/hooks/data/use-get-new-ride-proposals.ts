import { ToastUtils } from "@/components/utils/toast-helper";
import NewRideProposal from "@/lib/interfaces/entities/new-ride-proposal";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

export function useGetNewRideProposals() {
  const {
    data: newRideProposals,
    isLoading,
    isError,
    refetch,
  } = useQuery<NewRideProposal[], unknown>({
    queryKey: ["newRideProposals"],
    queryFn: async () => {
      try {
        const result = await invoke<NewRideProposal[]>(
          "get_new_ride_proposals",
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

  return { newRideProposals, isLoading, isError, refetch };
}
