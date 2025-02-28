import { useState, useRef, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router";
import { invoke } from "@tauri-apps/api/core";
import { ToastUtils } from "@/components/utils/toast-helper";
import LnfLog from "@/lib/interfaces/entities/lnf-log";
import { useQueryClient } from "@tanstack/react-query";

export function useEditLnfLog(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<LnfLog>({
    id: "",
    image: "",
    name: "",
    type: "",
    color: "",
    lastSeenLocation: "",
    finder: "",
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

  const handleChange = (field: keyof LnfLog, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleStatusChange = (value: string) => {
    setFormData({
      ...formData,
      status: value,
    });
  };

  const handleFinderChange = (value: string) => {
    setFormData({ ...formData, finder: value });
  };

  const handleOwnerChange = (value: string) => {
    setFormData({ ...formData, owner: value });
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImageFile(file);
      setImagePreview(imageUrl);
      setFormData((prev) => ({
        ...prev,
        image: imageUrl,
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (imageFile) {
        const arrayBuffer = await imageFile.arrayBuffer();
        const bytes = Array.from(new Uint8Array(arrayBuffer));

        await invoke("update_lnf_log", {
          id: formData.id,
          image: imageFile.name,
          name: formData.name,
          type: formData.type,
          color: formData.color,
          lastSeenLocation: formData.lastSeenLocation,
          finder: formData.finder,
          owner: formData.owner,
          status: formData.status,
          imageBytes: bytes,
        });
      } else {
        await invoke("update_lnf_log", {
          id: formData.id,
          name: formData.name,
          type: formData.type,
          color: formData.color,
          lastSeenLocation: formData.lastSeenLocation,
          finder: formData.finder,
          owner: formData.owner,
          status: formData.status,
          imageBytes: null,
        });
      }
      await queryClient.invalidateQueries({ queryKey: ["lnfLogs"] });

      ToastUtils.success({
        description: "Successfully update lost and found log!",
      });

      resetForm();
      if (onSuccess) onSuccess();

      navigate("/lost-and-found-staff/dashboard");
    } catch (error) {
      ToastUtils.error({ description: String(error) });
    } finally {
      setLoading(false);
    }
  };

  const loadItemForEdit = (item: LnfLog) => {
    setFormData({
      ...item,
    });
    if (item.image) {
      setImagePreview(item.image);
    }
  };

  const resetForm = () => {
    setFormData({
      id: "",
      image: "",
      name: "",
      type: "",
      color: "",
      lastSeenLocation: "",
      finder: "",
      owner: "",
      status: "",
    });
    setImageFile(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
  };

  return {
    formData,
    loading,
    imageFile,
    imagePreview,
    fileInputRef,
    handleInputChange,
    handleChange,
    handleOwnerChange,
    handleFinderChange,
    handleStatusChange,
    handleImageChange,
    handleImageClick,
    handleSubmit,
    loadItemForEdit,
    resetForm,
  };
}

export default useEditLnfLog;
