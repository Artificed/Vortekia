import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StoreDeletionProposal from "@/lib/interfaces/entities/store-deletion-proposal";
import { Clock } from "lucide-react";

interface ProcessedStoreDeletionProposalCardProps {
  proposal: StoreDeletionProposal;
  statusColor: string;
}

export function ProcessedStoreDeletionProposalCard({
  proposal,
  statusColor,
}: ProcessedStoreDeletionProposalCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Store Deletion Request</span>
          <Badge className={statusColor}>
            {proposal.approved === 1 ? "Approved" : "Rejected"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Reason: {proposal.reason}</p>
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
