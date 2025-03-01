import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import RideDeletionProposal from "@/lib/interfaces/entities/ride-deletion-proposal";

interface RideDeletionProposalsListProps {
  proposals: RideDeletionProposal[];
  setSelectedProposal: (proposal: RideDeletionProposal) => void;
  handleProposal: (id: string, approve: number) => Promise<void>;
  isPending: boolean;
}

export function RideDeletionProposalsList({
  proposals,
  setSelectedProposal,
  handleProposal,
  isPending,
}: RideDeletionProposalsListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {proposals.map((proposal: RideDeletionProposal) => (
        <Card
          key={proposal.id}
          className={`overflow-hidden ${isPending ? "border-amber-200" : "border-green-200"}`}
        >
          <CardHeader
            className={`p-4 pb-0 ${isPending ? "bg-amber-50" : "bg-green-50"}`}
          >
            <div className="flex items-center justify-between -translate-y-2">
              <CardTitle className="text-xl">Deletion Request</CardTitle>
              {!isPending && (
                <Badge
                  variant={proposal.approved ? "default" : "destructive"}
                  className="mt-2"
                >
                  {proposal.approved ? "Approved" : "Rejected"}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Ride ID</h3>
              <p className="mt-1">{proposal.rideId}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Reason for Deletion
              </h3>
              <p className="mt-1">{proposal.reason}</p>
            </div>
            {isPending ? (
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
            ) : (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setSelectedProposal(proposal)}
              >
                View Details
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
