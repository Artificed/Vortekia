import { useState } from "react";
import { useNavigate } from "react-router";
import useAuth from "@/hooks/auth/use-auth";

export default function useStaffLoginForm() {
  const auth = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState<string | null>(null);
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
    setError(null);

    if (!auth) {
      setError("Authentication system is unavailable.");
      setLoading(false);
      return;
    }

    const result = await auth.loginStaff(formData.username, formData.password);
    if (result) {
      setError(result);
    } else {
      navigate("/dashboard");
    }

    setLoading(false);
  };

  return {
    formData,
    error,
    loading,
    handleChange,
    handleLogin,
  };
}
