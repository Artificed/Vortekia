import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import NewRideProposal from "@/lib/interfaces/entities/new-ride-proposal";

interface NewRideProposalsListProps {
  proposals: NewRideProposal[];
  setSelectedProposal: (proposal: NewRideProposal) => void;
  handleProposal: (id: string, approve: number) => Promise<void>;
  isPending: boolean;
}

export function NewRideProposalsList({
  proposals,
  setSelectedProposal,
  handleProposal,
  isPending,
}: NewRideProposalsListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {proposals.map((proposal: NewRideProposal) => (
        <Card
          key={proposal.id}
          className={`overflow-hidden ${!isPending ? "border-green-200" : ""}`}
        >
          <div className="h-48 w-full overflow-hidden relative">
            <img
              src={proposal.image}
              alt={proposal.rideName}
              className="w-full h-full object-cover"
            />
            {!isPending && (
              <div className="absolute top-2 right-2">
                <Badge variant="secondary" className="text-sm">
                  New Ride
                </Badge>
              </div>
            )}
          </div>
          <CardHeader className="p-4 pb-0">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl">{proposal.rideName}</CardTitle>
              {isPending ? (
                <Badge variant="secondary">New Ride</Badge>
              ) : (
                <Badge variant={proposal.approved ? "default" : "destructive"}>
                  {proposal.approved ? "Approved" : "Rejected"}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Cost Review</h3>
              <p className="mt-1">{proposal.costReview}</p>
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
