import CooNavbar from "@/components/navbars/coo-navbar";
import { useGetNewRideProposals } from "@/hooks/data/use-get-new-ride-proposals";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import NewRideProposal from "@/lib/interfaces/entities/new-ride-proposal";

export default function CooViewProposal() {
  const { newRideProposals } = useGetNewRideProposals();
  const [selectedProposal, setSelectedProposal] =
    useState<NewRideProposal | null>(null);

  const handleApprove = (id: string): void => {
    // Add your approval logic here
    console.log(`Approved proposal ${id}`);
  };

  const handleReject = (id: string): void => {
    // Add your rejection logic here
    console.log(`Rejected proposal ${id}`);
  };

  return (
    <>
      <CooNavbar />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">New Ride Proposals</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newRideProposals && newRideProposals.length > 0 ? (
            newRideProposals.map((proposal: NewRideProposal) => (
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
                      onClick={() => handleApprove(proposal.id)}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={() => handleReject(proposal.id)}
                    >
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">No new ride proposals available</p>
            </div>
          )}
        </div>

        {selectedProposal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{selectedProposal.rideName}</CardTitle>
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
                    Cancel
                  </Button>
                  <Button
                    variant="default"
                    onClick={() => {
                      handleApprove(selectedProposal.id);
                      setSelectedProposal(null);
                    }}
                  >
                    Approve Proposal
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      handleReject(selectedProposal.id);
                      setSelectedProposal(null);
                    }}
                  >
                    Reject Proposal
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </>
  );
}
