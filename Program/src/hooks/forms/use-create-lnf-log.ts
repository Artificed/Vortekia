import { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router";
import LnfLog from "@/lib/interfaces/entities/lnf-log";
import { ToastUtils } from "@/components/utils/toast-helper";
import { invoke } from "@tauri-apps/api/core";

export function useCreateLnfLog() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<
    Omit<LnfLog, "id" | "image" | "finder">
  >({
    name: "",
    type: "",
    color: "",
    lastSeenLocation: "",
    owner: "",
    status: "",
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleStatusChange = (value: string) => {
    setFormData({
      ...formData,
      status: value,
    });
  };

  const handleOwnerChange = (value: string) => {
    setFormData({ ...formData, owner: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await invoke("insert_lnf_log", {
        name: formData.name,
        type: formData.type,
        color: formData.color,
        lastSeenLocation: formData.lastSeenLocation,
        owner: formData.owner,
        status: formData.status,
      });

      ToastUtils.success({
        description: "Successfully added lost and found log!",
      });

      resetForm();
      navigate("/lost-and-found-staff/dashboard");
    } catch (error) {
      ToastUtils.error({ description: String(error) });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      type: "",
      color: "",
      lastSeenLocation: "",
      owner: "",
      status: "",
    });
  };

  return {
    formData,
    loading,
    handleInputChange,
    handleOwnerChange,
    handleStatusChange,
    handleSubmit,
    resetForm,
  };
}

export default useCreateLnfLog;
