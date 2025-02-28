import { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router";
import LnfLog from "@/lib/interfaces/entities/lnf-log";
import { ToastUtils } from "@/components/utils/toast-helper";
import { invoke } from "@tauri-apps/api/core";

export function useCreateLnfLog() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<LnfLog, "id">>({
    image: "",
    name: "",
    type: "",
    color: "",
    lastSeenLocation: "",
    foundLocation: "",
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

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);

      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      try {
        const uniqueFileName = `${Date.now()}-${file.name}`;

        setFormData({
          ...formData,
          image: uniqueFileName,
        });
      } catch (error) {
        ToastUtils.error({ description: String(error) });
      }

      setFormData({
        ...formData,
        image: file.name,
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (imageFile) {
        const arrayBuffer = await imageFile.arrayBuffer();
        const bytes = Array.from(new Uint8Array(arrayBuffer));

        await invoke("insert_lnf_log", {
          image: formData.image,
          name: formData.name,
          type: formData.type,
          color: formData.color,
          lastSeenLocation: formData.lastSeenLocation,
          foundLocation: formData.foundLocation,
          finder: formData.finder,
          owner: formData.owner,
          status: formData.status,
          imageBytes: bytes,
        });
      } else {
        await invoke("insert_lnf_log", {
          image: null,
          name: formData.name,
          type: formData.type,
          color: formData.color,
          lastSeenLocation: formData.lastSeenLocation,
          foundLocation: null,
          finder: null,
          owner: formData.owner,
          status: formData.status,
          imageBytes: null,
        });
      }

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
      image: "",
      name: "",
      type: "",
      color: "",
      lastSeenLocation: "",
      foundLocation: "",
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
    handleInputChange,
    handleOwnerChange,
    handleFinderChange,
    handleStatusChange,
    handleImageChange,
    handleSubmit,
    resetForm,
  };
}

export default useCreateLnfLog;
