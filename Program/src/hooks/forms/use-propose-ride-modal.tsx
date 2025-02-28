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
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    try {
      await invoke("insert_new_ride_proposal", {
        rideName: formData.rideName,
        costReview: formData.costReview,
        image: formData.rideImage,
        imageBytes: imagePreview,
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
