import { ToastUtils } from "@/components/utils/toast-helper";
import Restaurant from "@/lib/interfaces/entities/restaurant";
import { useState } from "react";
import { useImageUpload } from "./use-image-upload";
import { invoke } from "@tauri-apps/api/core";
import { useQueryClient } from "@tanstack/react-query";

export const useEditRestaurant = (
  initialData: Restaurant,
  onClose: () => void,
) => {
  const [formData, setFormData] = useState({
    id: initialData.id,
    name: initialData.name,
    cuisineType: initialData.cuisineType,
    openingTime: initialData.openingTime.slice(0, 5),
    closingTime: initialData.closingTime.slice(0, 5),
    isOpen: initialData.isOpen,
    image: initialData.image,
  });

  const {
    imagePreview,
    imageFile,
    fileInputRef,
    handleImageClick,
    handleImageChange,
    setImagePreview,
  } = useImageUpload();

  useState(() => {
    setImagePreview(initialData.image);
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const queryClient = useQueryClient();

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await invoke("delete_restaurant", { id: formData.id });
      ToastUtils.success({ description: "Successfully deleted restaurant!" });
      queryClient.invalidateQueries({ queryKey: ["restaurants"] });
      onClose();
    } catch (error) {
      ToastUtils.error({ description: String(error) });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const isOpen = formData.isOpen ? 1 : 0;

    try {
      if (imageFile) {
        const arrayBuffer = await imageFile.arrayBuffer();
        const bytes = Array.from(new Uint8Array(arrayBuffer));

        await invoke("update_restaurant", {
          restaurantId: formData.id,
          name: formData.name,
          openingTime: formData.openingTime + ":00",
          closingTime: formData.closingTime + ":00",
          cuisineType: formData.cuisineType,
          imageName: imageFile?.name,
          imageBytes: bytes,
          isOpen: isOpen,
        });
      } else {
        await invoke("update_restaurant", {
          restaurantId: formData.id,
          name: formData.name,
          openingTime: formData.openingTime + ":00",
          closingTime: formData.closingTime + ":00",
          cuisineType: formData.cuisineType,
          imageName: null,
          imageBytes: null,
          isOpen: isOpen,
        });
      }
      ToastUtils.success({ description: "Successfully edited restaurant!" });
      queryClient.invalidateQueries({ queryKey: ["restaurants"] });
      onClose();
    } catch (error) {
      ToastUtils.error({ description: String(error) });
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    imagePreview,
    loading,
    fileInputRef,
    handleChange,
    handleImageClick,
    handleImageChange,
    handleSubmit,
    handleDelete,
  };
};
