import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash } from "lucide-react";
import { useDeleteStoreProposal } from "@/hooks/forms/use-store-deletion-proposal";
import { useParams } from "react-router";

export default function DeleteStoreProposalModal() {
  const params = useParams();

  const {
    isOpen,
    setIsOpen,
    reason,
    setReason,
    loading,
    resetForm,
    handleSubmit,
  } = useDeleteStoreProposal(params.storeId || "");

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="px-4 rounded-md">
          <Trash className="h-4 w-4 mr-2" />
          Request Store Deletion
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Request Store Deletion
          </DialogTitle>
          <DialogDescription>
            Submit a proposal to delete a store. This requires approval before
            proceeding.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Deletion</Label>
            <Textarea
              id="reason"
              name="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please provide a detailed reason for requesting store deletion"
              required
              className="w-full min-h-32"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                setIsOpen(false);
              }}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" variant="destructive" disabled={loading}>
              {loading ? "Submitting..." : "Submit Deletion Request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
