import { ToastUtils } from "@/components/utils/toast-helper";
import { invoke } from "@tauri-apps/api/core";
import { FormEvent, useState } from "react";
import { useImageUpload } from "./use-image-upload";
import { useQueryClient } from "@tanstack/react-query";

interface SouvenirFormData {
  name: string;
  price: number;
  description: string;
  storeId: string;
}

export function useAddSouvenir(initialStoreId: string = "") {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<SouvenirFormData>({
    name: "",
    price: 0,
    description: "",
    storeId: initialStoreId,
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

  const queryClient = useQueryClient();

  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (field: keyof SouvenirFormData, value: string): void => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    if (value === "") {
      handleChange("price", "0");
    } else {
      const numValue = parseFloat(value);
      if (!isNaN(numValue) && numValue >= 0) {
        handleChange("price", value);
      }
    }
  };

  const resetForm = (): void => {
    setFormData({
      name: "",
      price: 0,
      description: "",
      storeId: initialStoreId,
    });
    setImagePreview(null);
    setImageFile(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    if (!formData.storeId) {
      ToastUtils.error({ description: "Please select a store" });
      setLoading(false);
      return;
    }

    if (!imageFile) {
      ToastUtils.error({ description: "Image file must be provided!" });
      setLoading(false);
      return;
    }

    try {
      const arrayBuffer = await imageFile.arrayBuffer();
      const bytes = Array.from(new Uint8Array(arrayBuffer));

      await invoke("insert_new_souvenir", {
        name: formData.name,
        price: Number.parseInt(String(formData.price)),
        description: formData.description,
        storeId: formData.storeId,
        imageName: imageFile.name,
        imageBytes: bytes,
      });

      resetForm();
      setIsOpen(false);
      ToastUtils.success({
        description: "Successfully added new souvenir!",
      });
      queryClient.invalidateQueries({
        queryKey: ["souvenirs", formData.storeId],
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
    handlePriceChange,
    handleImageClick,
    handleImageChange,
    resetForm,
    handleSubmit,
  };
}
