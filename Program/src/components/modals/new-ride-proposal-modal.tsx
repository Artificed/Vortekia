import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import NewRideProposal from "@/lib/interfaces/entities/new-ride-proposal";
import { TimeSelectionModal } from "./time-selection-modal";

interface NewRideProposalModalProps {
  proposal: NewRideProposal;
  onClose: () => void;
  onApprove: (openingTime: string, closingTime: string) => void;
  onReject: () => void;
}

export function NewRideProposalModal({
  proposal,
  onClose,
  onApprove,
  onReject,
}: NewRideProposalModalProps) {
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);

  const handleApproveClick = () => {
    setIsTimeModalOpen(true);
  };

  const handleTimeConfirmation = (openingTime: string, closingTime: string) => {
    onApprove(openingTime, closingTime);
    setIsTimeModalOpen(false);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>{proposal.rideName}</CardTitle>
                <div className="flex space-x-2 mt-1">
                  <Badge variant="secondary">New Ride</Badge>
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
            <div className="aspect-video overflow-hidden rounded-md">
              <img
                src={proposal.image}
                alt={proposal.rideName}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Proposal ID</h3>
              <p className="mt-1">{proposal.id}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Cost Review</h3>
              <p className="mt-1">{proposal.costReview}</p>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>

              {proposal.done === 0 && (
                <>
                  <Button variant="default" onClick={handleApproveClick}>
                    Approve Proposal
                  </Button>
                  <Button variant="destructive" onClick={onReject}>
                    Reject Proposal
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <TimeSelectionModal
        isOpen={isTimeModalOpen}
        onClose={() => setIsTimeModalOpen(false)}
        onConfirm={handleTimeConfirmation}
        title="Set Ride Operating Hours"
      />
    </>
  );
}
