import { useState } from "react";
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
import { ToastUtils } from "../utils/toast-helper";
import { invoke } from "@tauri-apps/api/core";

interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TopUpModal({ isOpen, onClose }: TopUpModalProps) {
  const auth = useAuth();
  const [amount, setAmount] = useState("");

  const handleTopUp = async () => {
    if (!amount) {
      ToastUtils.error({ description: "Please fill in the field!" });
    } else if (isNaN(Number(amount))) {
      ToastUtils.error({ description: "Balance must be a number!" });
    } else if (Number(amount) < 0) {
      ToastUtils.error({
        description: "You can't top up with a negative value!",
      });
    } else {
      try {
        await invoke("add_current_user_balance", { balance: Number(amount) });
        ToastUtils.success({
          description: "Successfully topped up balance!",
        });
        setAmount("");
        auth?.refreshCurrentUser();
      } catch (e) {
        ToastUtils.error({
          description: String(e),
        });
      }
    }
  };

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
            min="1"
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
