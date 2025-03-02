import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, UtensilsCrossed, X } from "lucide-react";
import NewStoreProposal from "@/lib/interfaces/entities/new-store-proposal";

interface PendingNewStoreProposalCardProps {
  proposal: NewStoreProposal;
  onApprove: (proposal: NewStoreProposal) => void;
  onReject: (proposal: NewStoreProposal) => void;
  isLoading: boolean;
}

export default function PendingNewStoreProposalCard({
  proposal,
  onApprove,
  onReject,
  isLoading,
}: PendingNewStoreProposalCardProps) {
  return (
    <Card key={proposal.id} className="overflow-hidden">
      <div className="h-60 overflow-hidden relative border-2 border-dashed rounded-xl mx-6">
        {proposal.storeImage ? (
          <img
            src={proposal.storeImage}
            alt={proposal.storeName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <UtensilsCrossed size={48} className="text-gray-400" />
          </div>
        )}
      </div>
      <CardHeader>
        <CardTitle className="flex justify-between items-start">
          <span>{proposal.storeName}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-600 line-clamp-3">
            {proposal.storeDescription}
          </p>
          <p className="text-sm text-gray-600">Reason: {proposal.reason}</p>
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
