import { ToastUtils } from "@/components/utils/toast-helper";
import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";

export function useDeleteStoreProposal(storeId: string) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState("");

  const resetForm = () => {
    setReason("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!storeId) {
      ToastUtils.error({
        description: "Store ID not specified!",
      });
      return;
    }

    if (!reason) {
      ToastUtils.error({
        description: "Please fill in all the required fields!",
      });
      return;
    }

    try {
      setLoading(true);

      await invoke("insert_store_deletion_proposal", {
        storeId: storeId,
        reason: reason,
      });

      ToastUtils.success({
        description: "Store deletion proposal submitted successfully!",
      });

      resetForm();
      setIsOpen(false);
    } catch (error) {
      ToastUtils.error({ description: String(error) });
    } finally {
      setLoading(false);
    }
  };

  return {
    isOpen,
    setIsOpen,
    reason,
    setReason,
    loading,
    resetForm,
    handleSubmit,
  };
}
