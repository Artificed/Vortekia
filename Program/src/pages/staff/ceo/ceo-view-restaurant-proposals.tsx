import { Card, CardContent } from "@/components/ui/card";
import ProcessedProposalCard from "@/components/partials/cfo/proccessed-restaurant-proposal-card";
import PendingProposalCard from "@/components/partials/cfo/pending-restaurant-proposal-card";
import { useCeoManageRestaurantProposals } from "@/hooks/forms/use-ceo-manage-restaurant-proposals";
import CeoNavbar from "@/components/navbars/ceo-navbar";

export default function CeoViewRestaurantProposals() {
  const {
    pendingProposals,
    processedProposals,
    handleApprove,
    handleReject,
    isLoading,
  } = useCeoManageRestaurantProposals();

  return (
    <div className="min-h-screen bg-gray-50">
      <CeoNavbar />
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
                <PendingProposalCard
                  key={proposal.id}
                  proposal={proposal}
                  onApprove={handleApprove}
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
                  No processed restaurant proposals
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {processedProposals.map((proposal) => (
                <ProcessedProposalCard
                  key={proposal.id}
                  proposal={proposal}
                  statusColor={
                    proposal.ceoApproved === 1 ? "bg-green-500" : "bg-red-500"
                  }
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
