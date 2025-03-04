interface StoreDeletionProposal {
  id: string;
  storeId: string;
  reason: string;
  approved: number;
  done: number;
}

export default StoreDeletionProposal;
