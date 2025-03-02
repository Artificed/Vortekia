import { ToastUtils } from "@/components/utils/toast-helper";
import NewStoreProposalForm from "@/lib/interfaces/props/new-store-proposal-form";
import { invoke } from "@tauri-apps/api/core";
import { FormEvent, useState } from "react";
import { useImageUpload } from "./use-image-upload";

export function useProposeNewStore() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<NewStoreProposalForm>({
    storeName: "",
    description: "",
    reason: "",
  });

  const {
    imagePreview,
    imageFile,
    setImageFile,
    fileInputRef,
    handleImageClick,
    handleImageChange,
    setImagePreview,
  } = useImageUpload();

  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (
    field: keyof NewStoreProposalForm,
    value: string,
  ): void => {
    setFormData((prev: NewStoreProposalForm) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = (): void => {
    setFormData({
      storeName: "",
      description: "",
      reason: "",
    });
    setImagePreview(null);
    setImageFile(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    if (!imageFile) {
      ToastUtils.error({ description: "Image file must be filled!" });
      setLoading(false);
      return;
    }

    try {
      const arrayBuffer = await imageFile.arrayBuffer();
      const bytes = Array.from(new Uint8Array(arrayBuffer));

      await invoke("insert_new_store_proposal", {
        storeName: formData.storeName,
        description: formData.description,
        reason: formData.reason,
        image: imageFile.name,
        imageBytes: bytes,
      });

      resetForm();
      setIsOpen(false);
      ToastUtils.success({
        description: "Successfully submitted new ride proposal!",
      });
    } catch (error) {
      ToastUtils.error({ description: String(error) });
    } finally {
      setLoading(false);
    }
  };

  return {
    isOpen,
    setIsOpen,
    formData,
    imagePreview,
    loading,
    fileInputRef,
    handleChange,
    handleImageClick,
    handleImageChange,
    resetForm,
    handleSubmit,
  };
}
