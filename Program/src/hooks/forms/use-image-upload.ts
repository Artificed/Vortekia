import { useState, useRef, ChangeEvent } from "react";

export function useImageUpload() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (event?: ChangeEvent<HTMLInputElement>) => {
    if (!event) return; // Avoid errors when calling reset

    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
      setImageFile(file);
    }
  };

  const resetImage = () => {
    setImagePreview(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return {
    imagePreview,
    imageFile,
    fileInputRef,
    handleImageClick,
    handleImageChange,
    resetImage,
  };
}
