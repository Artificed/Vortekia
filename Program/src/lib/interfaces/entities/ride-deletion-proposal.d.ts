interface RideDeletionProposal {
  id: string;
  rideId: string;
  reason: string;
  approved: number;
  done: number;
}

export default RideDeletionProposal;
