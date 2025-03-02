import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import CeoNavbar from "@/components/navbars/ceo-navbar";
import { useCeoManageNewStoreProposals } from "@/hooks/forms/use-ceo-manage-store-proposals";
import PendingNewStoreProposalCard from "@/components/partials/ceo/pending-new-store-proposal-card";
import ProcessedNewStoreProposalCard from "@/components/partials/ceo/processed-new-store-proposal-card";
import { TimeSelectionModal } from "@/components/modals/time-selection-modal";
import NewStoreProposal from "@/lib/interfaces/entities/new-store-proposal";

export default function CeoViewStoreProposals() {
  const {
    pendingProposals,
    processedProposals,
    updateProposal,
    handleReject,
    isLoading,
  } = useCeoManageNewStoreProposals();

  const [modalOpen, setModalOpen] = useState(false);
  const [currentProposal, setCurrentProposal] =
    useState<NewStoreProposal | null>(null);

  const handleApproveClick = (proposal: NewStoreProposal) => {
    setCurrentProposal(proposal);
    setModalOpen(true);
  };

  const handleModalConfirm = (openingTime: string, closingTime: string) => {
    if (currentProposal) {
      updateProposal(currentProposal, 1, openingTime, closingTime);
    }
    setModalOpen(false);
    setCurrentProposal(null);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setCurrentProposal(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CeoNavbar />
      <div className="container mx-auto pt-24 px-4 pb-10">
        <h1 className="text-3xl font-bold my-6">Store Proposals</h1>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">
            Pending Approval ({pendingProposals.length})
          </h2>
          {pendingProposals.length === 0 ? (
            <Card>
              <CardContent className="py-2">
                <p className="text-center text-gray-500">
                  No pending store proposals
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingProposals.map((proposal) => (
                <PendingNewStoreProposalCard
                  key={proposal.id}
                  proposal={proposal}
                  onApprove={handleApproveClick}
                  onReject={handleReject}
                  isLoading={isLoading}
                />
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
                  No processed store proposals
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {processedProposals.map((proposal) => (
                <ProcessedNewStoreProposalCard
                  key={proposal.id}
                  proposal={proposal}
                  statusColor={
                    proposal.approved === 1 ? "bg-green-500" : "bg-red-500"
                  }
                />
              ))}
            </div>
          )}
        </section>
      </div>

      <TimeSelectionModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
        title="Select Operating Hours"
      />
    </div>
  );
}
