import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import CeoNavbar from "@/components/navbars/ceo-navbar";
import { useCeoManageNewStoreProposals } from "@/hooks/forms/use-ceo-manage-new-store-proposals";
import { useCeoManageStoreDeletionProposals } from "@/hooks/forms/use-ceo-manage-store-deletion-proposals";
import PendingNewStoreProposalCard from "@/components/partials/ceo/pending-new-store-proposal-card";
import ProcessedNewStoreProposalCard from "@/components/partials/ceo/processed-new-store-proposal-card";
import { TimeSelectionModal } from "@/components/modals/time-selection-modal";
import NewStoreProposal from "@/lib/interfaces/entities/new-store-proposal";
import StoreDeletionProposal from "@/lib/interfaces/entities/store-deletion-proposal";
import { PendingStoreDeletionProposalCard } from "@/components/partials/ceo/pending-store-deletion-proposal-card";
import { ProcessedStoreDeletionProposalCard } from "@/components/partials/ceo/processed-store-deletion-proposal-card";

export default function CeoViewProposals() {
  const {
    pendingProposals: pendingNewStores,
    processedProposals: processedNewStores,
    updateProposal: updateNewStoreProposal,
    handleReject: rejectNewStoreProposal,
    isLoading: isNewStoreLoading,
  } = useCeoManageNewStoreProposals();

  const {
    pendingProposals: pendingStoreDeletions,
    processedProposals: processedStoreDeletions,
    updateProposal: updateStoreDeletionProposal,
    handleReject: rejectStoreDeletionProposal,
    isLoading: isStoreDeletionLoading,
  } = useCeoManageStoreDeletionProposals();

  const [modalOpen, setModalOpen] = useState(false);
  const [currentProposal, setCurrentProposal] =
    useState<NewStoreProposal | null>(null);

  const handleApproveClick = (proposal: NewStoreProposal) => {
    setCurrentProposal(proposal);
    setModalOpen(true);
  };

  const handleModalConfirm = (openingTime: string, closingTime: string) => {
    if (currentProposal) {
      updateNewStoreProposal(currentProposal, 1, openingTime, closingTime);
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
        <h1 className="text-3xl font-bold my-6">Manage Store Proposals</h1>
        <Tabs defaultValue="pending">
          <TabsList className="mb-6">
            <TabsTrigger value="pending">Pending Proposals</TabsTrigger>
            <TabsTrigger value="processed">Processed Proposals</TabsTrigger>
          </TabsList>

          {/* Pending proposals */}
          <TabsContent value="pending">
            <section className="mb-10">
              <h2 className="text-xl font-semibold mb-4">
                Pending New Store Proposals ({pendingNewStores.length})
              </h2>
              {pendingNewStores.length === 0 ? (
                <Card>
                  <CardContent className="py-2">
                    <p className="text-center text-gray-500">
                      No pending new store proposals
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pendingNewStores.map((proposal) => (
                    <PendingNewStoreProposalCard
                      key={proposal.id}
                      proposal={proposal}
                      onApprove={handleApproveClick}
                      onReject={rejectNewStoreProposal}
                      isLoading={isNewStoreLoading}
                    />
                  ))}
                </div>
              )}
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold mb-4">
                Pending Store Deletion Proposals ({pendingStoreDeletions.length}
                )
              </h2>
              {pendingStoreDeletions.length === 0 ? (
                <Card>
                  <CardContent className="py-2">
                    <p className="text-center text-gray-500">
                      No pending store deletion proposals
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pendingStoreDeletions.map(
                    (proposal: StoreDeletionProposal) => (
                      <PendingStoreDeletionProposalCard
                        key={proposal.id}
                        proposal={proposal}
                        onApprove={() =>
                          updateStoreDeletionProposal(proposal, 1)
                        }
                        onReject={rejectStoreDeletionProposal}
                        isLoading={isStoreDeletionLoading}
                      />
                    ),
                  )}
                </div>
              )}
            </section>
          </TabsContent>

          {/* Processed proposals */}
          <TabsContent value="processed">
            <section className="mb-10">
              <h2 className="text-xl font-semibold mb-4">
                Processed New Store Proposals ({processedNewStores.length})
              </h2>
              {processedNewStores.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-gray-500">
                      No processed new store proposals
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {processedNewStores.map((proposal) => (
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

            <section>
              <h2 className="text-xl font-semibold mb-4">
                Processed Store Deletion Proposals (
                {processedStoreDeletions.length})
              </h2>
              {processedStoreDeletions.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-gray-500">
                      No processed store deletion proposals
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {processedStoreDeletions.map(
                    (proposal: StoreDeletionProposal) => (
                      <ProcessedStoreDeletionProposalCard
                        key={proposal.id}
                        proposal={proposal}
                        statusColor={
                          proposal.approved === 1
                            ? "bg-green-500"
                            : "bg-red-500"
                        }
                      />
                    ),
                  )}
                </div>
              )}
            </section>
          </TabsContent>
        </Tabs>
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
