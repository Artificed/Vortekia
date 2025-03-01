import { ToastUtils } from "@/components/utils/toast-helper";
import RestaurantProposalProps from "@/lib/interfaces/props/restaurant-proposal-props";
import { invoke } from "@tauri-apps/api/core";
import { FormEvent, useState } from "react";
import { useImageUpload } from "./use-image-upload";

export function useProposeRestaurant() {
  const {
    imagePreview,
    imageFile,
    fileInputRef,
    handleImageClick,
    handleImageChange,
    resetImage,
  } = useImageUpload();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<RestaurantProposalProps>({
    name: "",
    image: "",
    openingTime: "12:00",
    closingTime: "17:00",
    cuisineType: "",
  });
  const [loading, setLoading] = useState<boolean>(false);

  const cuisineOptions = [
    "Western",
    "Chinese",
    "Japanese",
    "Korean",
    "French",
    "Italian",
    "Indian",
  ];

  const handleChange = (
    field: keyof RestaurantProposalProps,
    value: string,
  ): void => {
    setFormData((prev: RestaurantProposalProps) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = (): void => {
    setFormData({
      name: "",
      image: "",
      openingTime: "09:00",
      closingTime: "17:00",
      cuisineType: "",
    });
    resetImage();
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    if (!imageFile) {
      ToastUtils.error({ description: "Image file must be filled!" });
      setLoading(false);
      return;
    }

    if (formData.openingTime >= formData.closingTime) {
      ToastUtils.error({
        description: "Opening time must be earlier than closing time!",
      });
      setLoading(false);
      return;
    }

    try {
      const arrayBuffer = await imageFile.arrayBuffer();
      const bytes = Array.from(new Uint8Array(arrayBuffer));

      // await invoke("insert_new_restaurant_proposal", {
      //   name: formData.name,
      //   cuisineType: formData.cuisineType,
      //   openingTime: formData.openingTime + ":00",
      //   closingTime: formData.closingTime + ":00",
      //   image: imageFile.name,
      //   imageBytes: bytes,
      // });

      resetForm();
      setIsOpen(false);
      ToastUtils.success({
        description: "Successfully submitted new restaurant proposal!",
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
    cuisineOptions,
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
