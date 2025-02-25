import { useState } from "react";
import { useNavigate } from "react-router";
import useAuth from "@/hooks/auth/use-auth";
import { ToastUtils } from "@/components/utils/toast-helper";

export default function useStaffLoginForm() {
  const auth = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    setLoading(true);

    if (!auth) {
      ToastUtils.error({
        title: "Login Error",
        description: "Authentication system is unavailable",
      });
      setLoading(false);
      return;
    }

    const result = await auth.loginStaff(formData.username, formData.password);
    if (result) {
      ToastUtils.error({
        title: "Login Error",
        description: result,
      });
    } else {
      navigate("/dashboard");
    }

    setLoading(false);
  };

  return {
    formData,
    loading,
    handleChange,
    handleLogin,
  };
}
