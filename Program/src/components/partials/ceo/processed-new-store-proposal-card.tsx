import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NewStoreProposal from "@/lib/interfaces/entities/new-store-proposal";
import { Clock, UtensilsCrossed } from "lucide-react";

interface ProcessedStoreProposalCardProps {
  proposal: NewStoreProposal;
  statusColor: string;
}

export default function ProcessedStoreProposalCard({
  proposal,
  statusColor,
}: ProcessedStoreProposalCardProps) {
  return (
    <Card key={proposal.id} className="overflow-hidden border-l-4">
      <div className="h-40 overflow-hidden bg-gray-100 relative">
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
        <div className="absolute top-2 right-2">
          <Badge className={statusColor}>
            {proposal.approved === 1 ? "Approved" : "Rejected"}
          </Badge>
        </div>
      </div>
      <CardHeader>
        <CardTitle className="flex justify-between items-start">
          <span>{proposal.storeName}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-gray-600 line-clamp-2">
            {proposal.storeDescription}
          </p>
          <div className="flex items-center text-sm text-gray-600">
            <Clock size={16} className="mr-2" />
            <span>
              {proposal.done === 1
                ? proposal.approved === 1
                  ? "Approved"
                  : "Rejected"
                : "Pending Review"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
