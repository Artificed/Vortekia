import { format } from "date-fns";

import MaintenanceTask from "@/lib/interfaces/entities/maintenance-task";
import type React from "react";

import { useState } from "react";
import { useGetMaintenanceStaffs } from "../data/use-get-maintenance-staffs";
import { ToastUtils } from "@/components/utils/toast-helper";
import { invoke } from "@tauri-apps/api/core";

const generateTimeOptions = () => {
  const options = [];
  for (let hour = 7; hour <= 19; hour++) {
    for (let minute = 0; minute < 30; minute += 30) {
      const formattedHour = hour.toString().padStart(2, "0");
      const formattedMinute = minute.toString().padStart(2, "0");
      options.push(`${formattedHour}:${formattedMinute}`);
    }
  }
  return options;
};

const timeOptions = generateTimeOptions();

export function useMaintenanceTask() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { maintenanceStaffs } = useGetMaintenanceStaffs();

  const initialFormData: Partial<MaintenanceTask> = {
    name: "",
    description: "",
    assignedStaff: undefined,
    startTime: undefined,
    endTime: undefined,
    status: "Incoming",
  };

  const [formData, setFormData] =
    useState<Partial<MaintenanceTask>>(initialFormData);

  const [startTimeString, setStartTimeString] = useState<string>("");
  const [endTimeString, setEndTimeString] = useState<string>("");

  const handleChange = (field: keyof MaintenanceTask, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleStaffChange = (staffId: string) => {
    const selectedStaff = (maintenanceStaffs || []).find(
      (staff) => staff.id === staffId,
    );
    setFormData((prev) => ({
      ...prev,
      assignedStaff: selectedStaff,
    }));
  };

  const handleStatusChange = (status: string) => {
    setFormData((prev) => ({
      ...prev,
      status,
    }));
  };

  const handleStartTimeChange = (date: Date | undefined) => {
    setFormData((prev) => ({
      ...prev,
      startTime: date,
    }));
  };

  const handleEndTimeChange = (date: Date | undefined) => {
    setFormData((prev) => ({
      ...prev,
      endTime: date,
    }));
  };

  const handleStartTimeStringChange = (timeString: string) => {
    setStartTimeString(timeString);

    if (!timeString) return;

    const [hours, minutes] = timeString.split(":").map(Number);
    const date = formData.startTime ? new Date(formData.startTime) : new Date();
    date.setHours(hours, minutes, 0, 0);

    handleStartTimeChange(date);
  };

  const handleEndTimeStringChange = (timeString: string) => {
    setEndTimeString(timeString);

    if (!timeString) return;

    const [hours, minutes] = timeString.split(":").map(Number);
    const date = formData.endTime ? new Date(formData.endTime) : new Date();
    date.setHours(hours, minutes, 0, 0);

    handleEndTimeChange(date);
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setStartTimeString("");
    setEndTimeString("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.description ||
      !formData.assignedStaff ||
      !formData.startTime ||
      !formData.endTime ||
      !formData.status
    ) {
      ToastUtils.error({ description: "Please fill in all the fields!" });
      return;
    }

    if (
      formData.startTime &&
      formData.endTime &&
      formData.endTime < formData.startTime
    ) {
      ToastUtils.error({ description: "End time must be after start time!" });
      return;
    }

    setLoading(true);

    console.log(formData.assignedStaff);

    try {
      await invoke("insert_new_maintenance_task", {
        name: formData.name,
        description: formData.description,
        assignedStaff: formData.assignedStaff.id,
        startTime: format(formData.startTime, "yyyy-MM-dd HH:mm:ss"),
        endTime: format(formData.endTime, "yyyy-MM-dd HH:mm:ss"),
        status: formData.status!,
      });
      ToastUtils.success({
        description: "Successfully added maintenance task!",
      });
      resetForm();
      setIsOpen(false);
    } catch (error) {
      ToastUtils.error({ description: "Failed to create maintenance task" });
    } finally {
      setLoading(false);
    }
  };

  return {
    isOpen,
    setIsOpen,
    formData,
    loading,
    staffList: maintenanceStaffs,
    timeOptions,
    startTimeString,
    endTimeString,
    handleChange,
    handleStaffChange,
    handleStatusChange,
    handleStartTimeChange,
    handleEndTimeChange,
    handleStartTimeStringChange,
    handleEndTimeStringChange,
    resetForm,
    handleSubmit,
  };
}
