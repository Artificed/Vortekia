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

  const [openingTime, setOpeningTime] = useState<string>(
    formData.openingTime.substring(0, 5),
  );

  const [closingTime, setClosingTime] = useState<string>(
    formData.closingTime.substring(0, 5),
  );

  const handleOpeningTimeChange = (openingTime: string) => {
    setOpeningTime(openingTime);
    setFormData((prev) => ({
      ...prev,
      openingTime: openingTime,
    }));
  };

  const handleClosingTimeChange = (closingTime: string) => {
    setClosingTime(closingTime);
    setFormData((prev) => ({
      ...prev,
      closingTime: closingTime,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formatTime = (time: string | undefined): string | undefined => {
      if (!time) return undefined;

      if (time.length === 5) {
        return `${time}:00`;
      }
      return time;
    };

    try {
      await invoke("update_ride", {
        id: formData.id,
        image: formData.image,
        name: formData.name,
        price: formData.price,
        status: formData.status,
        openingTime: formatTime(formData.openingTime),
        closingTime: formatTime(formData.closingTime),
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
    openingTime,
    closingTime,
    handleChange,
    handleStatusChange,
    handleStaffChange,
    handleOpeningTimeChange,
    handleClosingTimeChange,
    handleSubmit,
  };
}
