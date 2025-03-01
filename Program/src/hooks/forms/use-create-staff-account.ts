import { ToastUtils } from "@/components/utils/toast-helper";
import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";
import { useNavigate } from "react-router";

export type StaffFormData = {
  username: string;
  password: string;
  role: string;
  shiftStart: string;
  shiftEnd: string;
};

export function useCreateStaffAccount() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<StaffFormData>({
    username: "",
    password: "",
    role: "",
    shiftStart: "",
    shiftEnd: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await invoke("register_staff", {
        username: formData.username,
        password: formData.password,
        role: formData.role,
        shiftStart: formData.shiftStart + ":00",
        shiftEnd: formData.shiftEnd + ":00",
      });

      ToastUtils.success({
        description: "Successfully created staff account!",
      });

      navigate("/coo/dashboard");
    } catch (error) {
      ToastUtils.error({
        description: error
          ? (error as string)
          : "Failed to create account. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return { formData, setFormData, handleChange, handleSubmit, loading };
}
