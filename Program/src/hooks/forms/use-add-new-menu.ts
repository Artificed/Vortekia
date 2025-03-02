import { ToastUtils } from "@/components/utils/toast-helper";
import { invoke } from "@tauri-apps/api/core";
import { FormEvent, useState } from "react";
import { useImageUpload } from "./use-image-upload";
import Menu from "@/lib/interfaces/entities/menu";

export function useAddMenu() {
  const {
    imagePreview,
    imageFile,
    fileInputRef,
    handleImageClick,
    handleImageChange,
    resetImage,
  } = useImageUpload();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<Omit<Menu, "id">>({
    name: "",
    restaurantId: "",
    price: 0,
    image: "",
  });
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (
    field: keyof Omit<Menu, "id">,
    value: string | number,
  ): void => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === "price" ? Number(value) : value,
    }));
  };

  const resetForm = (): void => {
    setFormData({
      name: "",
      restaurantId: "",
      price: 0,
      image: "",
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

    if (!formData.restaurantId) {
      ToastUtils.error({ description: "Please select a restaurant!" });
      setLoading(false);
      return;
    }

    try {
      const arrayBuffer = await imageFile.arrayBuffer();
      const bytes = Array.from(new Uint8Array(arrayBuffer));

      await invoke("insert_new_menu", {
        name: formData.name,
        restaurantId: formData.restaurantId,
        price: formData.price,
        imageName: imageFile.name,
        imageBytes: bytes,
      });

      resetForm();
      setIsOpen(false);
      ToastUtils.success({
        description: "Successfully submitted a new menu!",
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
