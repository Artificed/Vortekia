import CooNavbar from "@/components/navbars/coo-navbar";
import { useGetNewRideProposals } from "@/hooks/data/use-get-new-ride-proposals";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import NewRideProposal from "@/lib/interfaces/entities/new-ride-proposal";
import { invoke } from "@tauri-apps/api/core";
import { ToastUtils } from "@/components/utils/toast-helper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryClient } from "@tanstack/react-query";

export default function CooViewProposal() {
  const { newRideProposals } = useGetNewRideProposals();
  const [selectedProposal, setSelectedProposal] =
    useState<NewRideProposal | null>(null);
  const queryClient = useQueryClient();

  const handleProposal = async (id: string, approve: number) => {
    try {
      await invoke("update_new_ride_proposal_approval", { id, approve });
      queryClient.invalidateQueries({ queryKey: ["newRideProposals"] });
      ToastUtils.success({ description: "Successfully managed proposal!" });
    } catch (error) {
      ToastUtils.error({ description: String(error) });
    }
  };
  const pendingProposals = newRideProposals?.filter((p) => p.done === 0) || [];
  const completedProposals =
    newRideProposals?.filter((p) => p.done === 1) || [];

  return (
    <>
      <CooNavbar />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Ride Proposals</h1>

        <Tabs defaultValue="pending" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="pending">
              Pending ({pendingProposals.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedProposals.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingProposals.length > 0 ? (
                pendingProposals.map((proposal: NewRideProposal) => (
                  <Card key={proposal.id} className="overflow-hidden">
                    <div className="h-48 w-full overflow-hidden">
                      <img
                        src={proposal.image}
                        alt={proposal.rideName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader className="p-4 pb-0">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-xl">
                          {proposal.rideName}
                        </CardTitle>
                        <Badge
                          variant={proposal.approved ? "default" : "secondary"}
                        >
                          {proposal.approved ? "Approved" : "Pending"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Cost Review
                        </h3>
                        <p className="mt-1">{proposal.costReview}</p>
                      </div>

                      <div className="flex justify-between gap-2">
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => setSelectedProposal(proposal)}
                        >
                          View Details
                        </Button>
                        <Button
                          variant="default"
                          className="w-full"
                          onClick={() => handleProposal(proposal.id, 1)}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="destructive"
                          className="w-full"
                          onClick={() => handleProposal(proposal.id, 0)}
                        >
                          Reject
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">
                    No pending ride proposals available
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="completed">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedProposals.length > 0 ? (
                completedProposals.map((proposal: NewRideProposal) => (
                  <Card
                    key={proposal.id}
                    className="overflow-hidden border-green-200"
                  >
                    <div className="h-48 w-full overflow-hidden relative">
                      <img
                        src={proposal.image}
                        alt={proposal.rideName}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge variant="default" className="text-sm">
                          Completed
                        </Badge>
                      </div>
                    </div>
                    <CardHeader className="p-4 pb-0">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-xl">
                          {proposal.rideName}
                        </CardTitle>
                        <Badge
                          variant={
                            proposal.approved ? "default" : "destructive"
                          }
                        >
                          {proposal.approved ? "Approved" : "Rejected"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Cost Review
                        </h3>
                        <p className="mt-1">{proposal.costReview}</p>
                      </div>

                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setSelectedProposal(proposal)}
                      >
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">
                    No completed ride proposals available
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {selectedProposal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>{selectedProposal.rideName}</CardTitle>
                    <div className="flex space-x-2 mt-1">
                      <Badge
                        variant={
                          selectedProposal.approved ? "default" : "secondary"
                        }
                      >
                        {selectedProposal.approved ? "Approved" : "Pending"}
                      </Badge>
                      {selectedProposal.done === 1 && (
                        <Badge variant="outline" className="bg-green-50">
                          Completed
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedProposal(null)}
                  >
                    Close
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-video overflow-hidden rounded-md">
                  <img
                    src={selectedProposal.image}
                    alt={selectedProposal.rideName}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Proposal ID
                  </h3>
                  <p className="mt-1">{selectedProposal.id}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Cost Review
                  </h3>
                  <p className="mt-1">{selectedProposal.costReview}</p>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedProposal(null)}
                  >
                    Close
                  </Button>

                  {selectedProposal.done === 0 && (
                    <>
                      <Button
                        variant="default"
                        onClick={() => {
                          handleProposal(selectedProposal.id, 1);
                          setSelectedProposal(null);
                        }}
                      >
                        Approve Proposal
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          handleProposal(selectedProposal.id, 0);
                          setSelectedProposal(null);
                        }}
                      >
                        Reject Proposal
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </>
  );
}
