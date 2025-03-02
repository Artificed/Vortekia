import Restaurant from "@/lib/interfaces/entities/restaurant";
import { useState, useRef } from "react";

export const useEditRestaurant = (initialData: Restaurant) => {
  const [formData, setFormData] = useState({
    name: initialData.name,
    cuisineType: initialData.cuisineType,
    openingTime: initialData.openingTime.slice(0, 5),
    closingTime: initialData.closingTime.slice(0, 5),
    isOpen: initialData.isOpen,
    image: initialData.image,
  });

  const [imagePreview, setImagePreview] = useState(initialData.image);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setFormData((prev) => ({ ...prev, image: file.name }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Add your API call here
      console.log("Submitting:", formData);
      // await updateRestaurantAPI(initialData.id, formData);
      // onClose();
    } catch (error) {
      console.error("Error updating restaurant:", error);
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
  };
};
