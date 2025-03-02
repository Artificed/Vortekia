import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RestaurantProposal from "@/lib/interfaces/entities/restaurant-proposal";
import { Check, Clock, UtensilsCrossed, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PendingProposalCardProps {
  proposal: RestaurantProposal;
  onApprove: (proposal: RestaurantProposal) => void;
  onReject: (proposal: RestaurantProposal) => void;
  isLoading: boolean;
}

export default function PendingProposalCard({
  proposal,
  onApprove,
  onReject,
  isLoading,
}: PendingProposalCardProps) {
  return (
    <Card key={proposal.id} className="overflow-hidden">
      <div className="h-48 overflow-hidden bg-gray-100 relative">
        {proposal.image ? (
          <img
            src={proposal.image}
            alt={proposal.name}
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
          <span>{proposal.name}</span>
          <Badge>{proposal.cuisineType}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center text-sm text-gray-600">
            <Clock size={16} className="mr-2" />
            <span>
              {proposal.openingTime.slice(0, 5)} -{" "}
              {proposal.closingTime.slice(0, 5)}
            </span>
          </div>
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
