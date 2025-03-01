import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useAuth from "@/hooks/auth/use-auth";
import Customer from "@/lib/interfaces/entities/customer";
import { useHandleTopUp } from "@/hooks/utility/use-handle-top-up";

interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TopUpModal({ isOpen, onClose }: TopUpModalProps) {
  const auth = useAuth();
  const { amount, setAmount, handleTopUp } = useHandleTopUp();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Top Up Balance</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <label className="text-sm font-medium">
            Enter amount (Current Balance:{" "}
            <span className="font-semibold">
              {(auth?.user as Customer)?.balance ?? "0"}
            </span>
            ):
          </label>
          <Input
            type="text"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleTopUp}>Confirm</Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
