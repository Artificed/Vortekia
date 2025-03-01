import CooNavbar from "@/components/navbars/coo-navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import NewRideProposal from "@/lib/interfaces/entities/new-ride-proposal";
import RideDeletionProposal from "@/lib/interfaces/entities/ride-deletion-proposal";
import { useHandleNewRideProposal } from "@/hooks/forms/use-handle-new-ride-proposal";
import { useHandleRideDeletionProposal } from "@/hooks/forms/use-handle-ride-deletion-proposal";
import { NewRideProposalsList } from "@/components/partials/coo/new-ride-proposals-list";
import { RideDeletionProposalsList } from "@/components/partials/coo/ride-deletion-proposals-list";
import { NewRideProposalModal } from "@/components/modals/new-ride-proposal-modal";
import { RideDeletionProposalModal } from "@/components/modals/ride-deletion-proposal-modal";

export default function CooViewProposal() {
  const queryClient = useQueryClient();

  const {
    pendingNewRideProposals,
    completedNewRideProposals,
    handleNewRideProposal,
  } = useHandleNewRideProposal(queryClient);

  const {
    pendingDeletionProposals,
    completedDeletionProposals,
    handleDeletionProposal,
  } = useHandleRideDeletionProposal(queryClient);

  const [selectedProposal, setSelectedProposal] =
    useState<NewRideProposal | null>(null);
  const [selectedDeletionProposal, setSelectedDeletionProposal] =
    useState<RideDeletionProposal | null>(null);

  const totalPending =
    pendingNewRideProposals.length + pendingDeletionProposals.length;
  const totalCompleted =
    completedNewRideProposals.length + completedDeletionProposals.length;

  return (
    <>
      <CooNavbar />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Ride Proposals Management</h1>

        <Tabs defaultValue="pending" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="pending">
              Pending Proposals ({totalPending})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed Proposals ({totalCompleted})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            {pendingNewRideProposals.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">
                  New Ride Proposals
                </h2>
                <NewRideProposalsList
                  proposals={pendingNewRideProposals}
                  setSelectedProposal={setSelectedProposal}
                  handleProposal={handleNewRideProposal}
                  isPending={true}
                />
              </div>
            )}

            {pendingDeletionProposals.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Ride Deletion Proposals
                </h2>
                <RideDeletionProposalsList
                  proposals={pendingDeletionProposals}
                  setSelectedProposal={setSelectedDeletionProposal}
                  handleProposal={handleDeletionProposal}
                  isPending={true}
                />
              </div>
            )}

            {totalPending === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No pending proposals available</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed">
            {completedNewRideProposals.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">
                  Completed New Ride Proposals
                </h2>
                <NewRideProposalsList
                  proposals={completedNewRideProposals}
                  setSelectedProposal={setSelectedProposal}
                  handleProposal={handleNewRideProposal}
                  isPending={false}
                />
              </div>
            )}

            {completedDeletionProposals.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Completed Deletion Proposals
                </h2>
                <RideDeletionProposalsList
                  proposals={completedDeletionProposals}
                  setSelectedProposal={setSelectedDeletionProposal}
                  handleProposal={handleDeletionProposal}
                  isPending={false}
                />
              </div>
            )}

            {totalCompleted === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  No completed proposals available
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {selectedProposal && (
          <NewRideProposalModal
            proposal={selectedProposal}
            onClose={() => setSelectedProposal(null)}
            onApprove={() => {
              handleNewRideProposal(selectedProposal.id, 1);
              setSelectedProposal(null);
            }}
            onReject={() => {
              handleNewRideProposal(selectedProposal.id, 0);
              setSelectedProposal(null);
            }}
          />
        )}

        {selectedDeletionProposal && (
          <RideDeletionProposalModal
            proposal={selectedDeletionProposal}
            onClose={() => setSelectedDeletionProposal(null)}
            onApprove={() => {
              handleDeletionProposal(selectedDeletionProposal.id, 1);
              setSelectedDeletionProposal(null);
            }}
            onReject={() => {
              handleDeletionProposal(selectedDeletionProposal.id, 0);
              setSelectedDeletionProposal(null);
            }}
          />
        )}
      </div>
    </>
  );
}
