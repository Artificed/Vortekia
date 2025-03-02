import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RestaurantProposal from "@/lib/interfaces/entities/restaurant-proposal";
import { Clock, DollarSign, UtensilsCrossed } from "lucide-react";

interface ProcessedProposalCardProps {
  proposal: RestaurantProposal;
  statusColor: string;
}

export default function ProcessedProposalCard({
  proposal,
  statusColor,
}: ProcessedProposalCardProps) {
  return (
    <Card key={proposal.id} className="overflow-hidden border-l-4">
      <div className="h-40 overflow-hidden bg-gray-100 relative">
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
        <div className="absolute top-2 right-2">
          <Badge className={statusColor}>
            {proposal.cfoApproved === 1 ? "Approved" : "Rejected"}
          </Badge>
        </div>
      </div>
      <CardHeader>
        <CardTitle className="flex justify-between items-start">
          <span>{proposal.name}</span>
          <Badge variant="outline">{proposal.cuisineType}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <Clock size={16} className="mr-2" />
            <span>
              {proposal.openingTime.slice(0, 5)} -{" "}
              {proposal.closingTime.slice(0, 5)}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <DollarSign size={16} className="mr-2" />
            <span>
              {proposal.ceoDone === 1
                ? proposal.ceoApproved === 1
                  ? "Approved by CEO"
                  : "Rejected by CEO"
                : "Awaiting CEO review"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
