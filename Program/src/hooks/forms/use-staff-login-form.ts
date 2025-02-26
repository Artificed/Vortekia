import { useState } from "react";
import { useNavigate } from "react-router";
import useAuth from "@/hooks/auth/use-auth";
import { ToastUtils } from "@/components/utils/toast-helper";

export default function useStaffLoginForm() {
  const auth = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    if (!auth) {
      ToastUtils.error({
        title: "Login Error",
        description: "Authentication system is unavailable",
      });
      return;
    }

    const result = await auth.loginStaff(formData.username, formData.password);
    if (result != null) {
      ToastUtils.error({
        title: "Login Error",
        description: result,
      });
    } else {
      navigate("/dashboard");
    }
  };

  return {
    formData,
    loading: auth?.isLoading || false,
    handleChange,
    handleLogin,
  };
}
