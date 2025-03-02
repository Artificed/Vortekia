import CfoNavbar from "@/components/navbars/cfo-navbar";
import { useGetRestaurantProposals } from "@/hooks/data/use-get-restaurant-proposals";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, DollarSign, UtensilsCrossed, Check, X } from "lucide-react";
import { invoke } from "@tauri-apps/api/core";
import { ToastUtils } from "@/components/utils/toast-helper";
import RestaurantProposal from "@/lib/interfaces/entities/restaurant-proposal";

export default function CfoViewRestaurantProposals() {
  const { restaurantProposals, refetch } = useGetRestaurantProposals();

  const handleApproval = async (
    proposal: RestaurantProposal,
    action: "approve" | "reject",
  ) => {
    try {
      await invoke("update_new_restaurant_proposal_cfo_approval", {
        id: proposal.id,
        approve: action === "approve" ? 1 : 0,
      });

      ToastUtils.success({
        description: `Restaurant proposal ${action === "approve" ? "approved" : "rejected"} successfully!`,
      });

      refetch();
    } catch (error) {
      ToastUtils.error({ description: String(error) });
    }
  };

  if (!restaurantProposals) return;

  const pendingProposals = restaurantProposals.filter((p) => p.cfoDone === 0);
  const processedProposals = restaurantProposals.filter((p) => p.cfoDone === 1);

  return (
    <div className="min-h-screen bg-gray-50">
      <CfoNavbar />

      <div className="container mx-auto pt-24 px-4 pb-10">
        <h1 className="text-3xl font-bold my-6">Restaurant Proposals</h1>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">
            Pending Approval ({pendingProposals.length})
          </h2>

          {pendingProposals.length === 0 ? (
            <Card>
              <CardContent className="py-2">
                <p className="text-center text-gray-500">
                  No pending restaurant proposals
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingProposals.map((proposal) => (
                <Card key={proposal.id} className="overflow-hidden">
                  <div className="h-48 overflow-hidden bg-gray-100 relative">
                    {proposal.image ? (
                      <img
                        src={proposal.image}
                        alt={proposal.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <UtensilsCrossed size={48} className="text-gray-400" />
                      </div>
                    )}
                  </div>

                  <CardHeader>
                    <CardTitle className="flex justify-between items-start">
                      <span>{proposal.name}</span>
                      <Badge>{proposal.cuisineType}</Badge>
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock size={16} className="mr-2" />
                        <span>
                          {proposal.openingTime.slice(0, 5)} -{" "}
                          {proposal.closingTime.slice(0, 5)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-4">
                        <Button
                          variant="outline"
                          className="flex-1 border-green-500 text-green-600 hover:bg-green-50"
                          onClick={() => handleApproval(proposal, "approve")}
                        >
                          <Check size={16} className="mr-2" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 border-red-500 text-red-600 hover:bg-red-50"
                          onClick={() => handleApproval(proposal, "reject")}
                        >
                          <X size={16} className="mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            Previously Processed ({processedProposals.length})
          </h2>

          {processedProposals.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-gray-500">
                  No processed restaurant proposals
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {processedProposals.map((proposal) => (
                <Card key={proposal.id} className="overflow-hidden border-l-4">
                  <div className="h-40 overflow-hidden bg-gray-100 relative">
                    {proposal.image ? (
                      <img
                        src={proposal.image}
                        alt={proposal.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <UtensilsCrossed size={48} className="text-gray-400" />
                      </div>
                    )}

                    <div className="absolute top-2 right-2">
                      <Badge
                        className={
                          proposal.cfoApproved === 1
                            ? "bg-green-500"
                            : "bg-red-500"
                        }
                      >
                        {proposal.cfoApproved === 1 ? "Approved" : "Rejected"}
                      </Badge>
                    </div>
                  </div>

                  <CardHeader>
                    <CardTitle className="flex justify-between items-start">
                      <span>{proposal.name}</span>
                      <Badge variant="outline">{proposal.cuisineType}</Badge>
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock size={16} className="mr-2" />
                        <span>
                          {proposal.openingTime.slice(0, 5)} -{" "}
                          {proposal.closingTime.slice(0, 5)}
                        </span>
                      </div>

                      <div className="flex items-center text-sm text-gray-600">
                        <DollarSign size={16} className="mr-2" />
                        <span>
                          {proposal.ceoDone === 1
                            ? proposal.ceoApproved === 1
                              ? "Approved by CEO"
                              : "Rejected by CEO"
                            : "Awaiting CEO review"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
