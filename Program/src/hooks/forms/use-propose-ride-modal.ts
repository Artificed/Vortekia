import { ToastUtils } from "@/components/utils/toast-helper";
import RideProposalForm from "@/lib/interfaces/props/ride-proposal-form";
import { invoke } from "@tauri-apps/api/core";
import { ChangeEvent, FormEvent, useRef, useState } from "react";

export function useProposeRide() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<RideProposalForm>({
    rideName: "",
    rideImage: "",
    costReview: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: keyof RideProposalForm, value: string): void => {
    setFormData((prev: RideProposalForm) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageClick = (): void => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const result = event.target.result as string;
          setImagePreview(result);
          setFormData((prev) => ({
            ...prev,
            rideImage: file.name,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = (): void => {
    setFormData({
      rideName: "",
      rideImage: "",
      costReview: "",
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

      await invoke("insert_new_ride_proposal", {
        rideName: formData.rideName,
        costReview: formData.costReview,
        image: formData.rideImage,
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
