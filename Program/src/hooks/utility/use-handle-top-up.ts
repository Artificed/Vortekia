import { useState } from "react";
import useAuth from "@/hooks/auth/use-auth";
import { invoke } from "@tauri-apps/api/core";
import { ToastUtils } from "@/components/utils/toast-helper";

export function useHandleTopUp() {
  const auth = useAuth();
  const [amount, setAmount] = useState("");

  const handleTopUp = async () => {
    if (!amount) {
      ToastUtils.error({ description: "Please fill in the field!" });
      return;
    }

    const numericAmount = Number(amount);
    if (isNaN(numericAmount)) {
      ToastUtils.error({ description: "Balance must be a number!" });
      return;
    }

    if (numericAmount < 0) {
      ToastUtils.error({
        description: "You can't top up with a negative value!",
      });
      return;
    }

    try {
      await invoke("add_current_user_balance", { balance: numericAmount });
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
  };

  return { amount, setAmount, handleTopUp };
}
