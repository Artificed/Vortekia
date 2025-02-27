import { useState, ChangeEvent, FormEvent } from "react";
import useAuth from "../auth/use-auth";
import { useNavigate } from "react-router";
import LnfLog from "@/lib/interfaces/entities/lnf-log";

export function useCreateLnfLog() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<LnfLog, "id">>({
    image: "",
    itemName: "",
    itemType: "",
    itemColor: "",
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

  const handleStatusChange = (value: string) => {
    setFormData({
      ...formData,
      status: value,
    });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);

      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      setFormData({
        ...formData,
        image: "placeholder-image-url.jpg",
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Form submitted:", formData);

      resetForm();

      navigate("/lost-and-found/dashboard");
    } catch (error) {
      console.error("Error creating lost and found log:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      image: "",
      itemName: "",
      itemType: "",
      itemColor: "",
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
    handleInputChange,
    handleStatusChange,
    handleImageChange,
    handleSubmit,
    resetForm,
  };
}

export default useCreateLnfLog;
