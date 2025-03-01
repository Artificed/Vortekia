import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useQueryClient } from "@tanstack/react-query";
import Ride from "@/lib/interfaces/entities/ride";
import { ToastUtils } from "@/components/utils/toast-helper";

interface UseEditRideProps {
  ride: Ride;
  onSuccess?: () => void;
  onClose: () => void;
}

export function useEditRideForm({
  ride,
  onSuccess,
  onClose,
}: UseEditRideProps) {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<Ride>({
    ...ride,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? parseInt(value) : value,
    }));
  };

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      status: value,
    }));
  };

  const handleStaffChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      assignedStaff: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await invoke("update_ride", {
        id: formData.id,
        image: formData.image,
        name: formData.name,
        price: formData.price,
        status: formData.status,
        openingTime: formData.openingTime,
        closingTime: formData.closingTime,
        assignedStaff: formData.assignedStaff,
      });
      ToastUtils.success({ description: "Ride updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["rides"] });

      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (error) {
      ToastUtils.error({ description: String(error) });
    }
  };

  return {
    formData,
    handleChange,
    handleStatusChange,
    handleStaffChange,
    handleSubmit,
  };
}
