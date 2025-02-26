import { ToastUtils } from "@/components/utils/toast-helper";
import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";
import { useNavigate } from "react-router";

export function useCreateCustomerAccount() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    balance: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await invoke("register_customer", {
        username: formData.username,
        balance: parseInt(formData.balance),
      });

      ToastUtils.success({
        description: "Successfully created user account!",
      });

      navigate("/customer-service/dashboard");
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
