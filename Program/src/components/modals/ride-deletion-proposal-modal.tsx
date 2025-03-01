import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import RideDeletionProposal from "@/lib/interfaces/entities/ride-deletion-proposal";

interface RideDeletionProposalModalProps {
  proposal: RideDeletionProposal;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
}

export function RideDeletionProposalModal({
  proposal,
  onClose,
  onApprove,
  onReject,
}: RideDeletionProposalModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Ride Deletion Request</CardTitle>
              <div className="flex space-x-2 mt-1">
                <Badge
                  variant="secondary"
                  className="bg-amber-100 text-amber-800 hover:bg-amber-100"
                >
                  Deletion
                </Badge>
                {proposal.done === 1 && (
                  <Badge
                    variant={proposal.approved ? "default" : "destructive"}
                  >
                    {proposal.approved ? "Approved" : "Rejected"}
                  </Badge>
                )}
              </div>
            </div>
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Proposal ID</h3>
            <p className="mt-1">{proposal.id}</p>
          </div>

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

          <div className="flex justify-end gap-4 pt-4">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            {proposal.done === 0 && (
              <>
                <Button variant="default" onClick={onApprove}>
                  Approve Deletion
                </Button>
                <Button variant="destructive" onClick={onReject}>
                  Reject Deletion
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
