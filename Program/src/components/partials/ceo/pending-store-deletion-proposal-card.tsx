import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import StoreDeletionProposal from "@/lib/interfaces/entities/store-deletion-proposal";

interface PendingStoreDeletionProposalCardProps {
  proposal: StoreDeletionProposal;
  onApprove: (proposal: StoreDeletionProposal) => void;
  onReject: (proposal: StoreDeletionProposal) => void;
  isLoading: boolean;
}

export function PendingStoreDeletionProposalCard({
  proposal,
  onApprove,
  onReject,
  isLoading,
}: PendingStoreDeletionProposalCardProps) {
  return (
    <Card key={proposal.id} className="overflow-hidden">
      <CardHeader>
        <CardTitle className="flex justify-between items-start ">
          <span>Store Deletion Request</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Store ID</p>
          <p>{proposal.storeId}</p>
          <p className="text-sm text-gray-600">Reason for Deletion</p>
          <p>{proposal.reason}</p>
          <div className="flex items-center gap-2 mt-4">
            <Button
              variant="outline"
              className="flex-1 border-green-500 text-green-600 hover:bg-green-50"
              onClick={() => onApprove(proposal)}
              disabled={isLoading}
            >
              <Check size={16} className="mr-2" />
              Approve
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-red-500 text-red-600 hover:bg-red-50"
              onClick={() => onReject(proposal)}
              disabled={isLoading}
            >
              <X size={16} className="mr-2" />
              Reject
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
