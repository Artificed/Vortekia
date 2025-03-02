import { ToastUtils } from "@/components/utils/toast-helper";
import RestaurantProposal from "@/lib/interfaces/entities/restaurant-proposal";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

export function useGetCfoApprovedRestaurantProposals() {
  const {
    data: restaurantProposals,
    isLoading,
    isError,
    refetch,
  } = useQuery<RestaurantProposal[], unknown>({
    queryKey: ["cfoApprovedRestaurantProposals"],
    queryFn: async () => {
      try {
        const result = await invoke<RestaurantProposal[]>(
          "get_cfo_approved_restaurant_proposals",
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

  return { restaurantProposals, isLoading, isError, refetch };
}
