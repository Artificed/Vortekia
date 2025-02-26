import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import useAuth from "@/hooks/auth/use-auth";
import { ToastUtils } from "@/components/utils/toast-helper";
import Staff from "@/lib/interfaces/entities/staff";

export default function useStaffLoginForm() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    if (auth?.user && isSubmitting) {
      try {
        if ("role" in auth.user) {
          const staffUser = auth.user as Staff;

          if (staffUser.role) {
            const path =
              staffUser.role.toLowerCase().replace(" ", "-") + "/dashboard";
            navigate(path);
          } else {
            ToastUtils.error({
              description: "User role information is missing",
            });
          }
        } else {
          ToastUtils.error({
            description: "This account does not have staff access",
          });
        }

        setIsSubmitting(false);
      } catch (error) {
        ToastUtils.error({
          description: "An unexpected error occurred",
        });
        setIsSubmitting(false);
      }
    }
  }, [auth?.user, isSubmitting, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    if (!auth) {
      ToastUtils.error({
        description: "Authentication system is unavailable",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await auth.loginStaff(formData.username, formData.password);
    } catch (error) {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    loading: isSubmitting || auth?.isLoading || false,
    handleChange,
    handleLogin,
  };
}
