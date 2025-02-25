import { useState } from "react";
import useAuth from "../auth/use-auth";
import { ToastUtils } from "@/components/utils/toast-helper";

export function useCustomerLoginForm() {
  const auth = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uid, setUid] = useState("");

  const handleDialogSubmit = () => {
    if (!uid.trim()) {
      ToastUtils.error({
        title: "Login Error",
        description: "Please enter your UID!",
      });
      return;
    }
    auth?.loginCustomer(uid);

    setIsDialogOpen(false);
    setUid("");
  };

  return {
    isDialogOpen,
    setIsDialogOpen,
    uid,
    setUid,
    handleDialogSubmit,
  };
}
