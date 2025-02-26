import { ToastUtils } from "@/components/utils/toast-helper";
import { useInactivityTimer } from "@/hooks/auth/use-inactivity-logout";
import Customer from "@/lib/interfaces/entities/customer";
import Staff from "@/lib/interfaces/entities/staff";
import { User } from "@/lib/interfaces/types/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";
import { createContext, ReactNode, useCallback, useRef } from "react";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isError: boolean;
  logout: () => Promise<void>;
  refreshCurrentUser: () => Promise<void>;
  loginCustomer: (id: string) => Promise<void>;
  loginStaff: (username: string, password: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const isCustomer = useRef(false);

  const {
    data: user,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      try {
        const currentUser = await invoke<any>("get_current_user");
        if (Object.keys(currentUser)[0] === "Customer") {
          isCustomer.current = true;
          return currentUser.Customer as Customer;
        } else if (Object.keys(currentUser)[0] === "Staff") {
          isCustomer.current = false;
          return currentUser.Staff as Staff;
        }
        return null;
      } catch (error) {
        return null;
      }
    },
  });

  const refreshCurrentUser = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    await refetch();
  }, [queryClient, refetch]);

  const loginCustomerMutation = useMutation({
    mutationFn: async (id: string) => {
      return await invoke("login_customer", { id });
    },
    onSuccess: async () => {
      await refreshCurrentUser();
      ToastUtils.success({
        title: "Login Success",
        description: "Successfully logged in!",
      });
    },
    onError: (error) => {
      ToastUtils.error({
        title: "Login Error",
        description: error.message as string,
      });
      throw error;
    },
  });

  const loginStaffMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      return await invoke("login_staff", credentials);
    },
    onSuccess: async () => {
      await refreshCurrentUser();
      ToastUtils.success({
        title: "Login Success",
        description: "Successfully logged in!",
      });
    },
    onError: (error) => {
      ToastUtils.error({
        title: "Login Error",
        description: error.message as string,
      });
      throw error;
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      return await invoke("logout_user");
    },
    onSuccess: async (_, showDefaultLogoutToast: boolean) => {
      await refreshCurrentUser();

      if (showDefaultLogoutToast) {
        ToastUtils.info({
          title: "Logged Out",
          description: "You have been logged out successfully.",
        });
      }
    },
    onError: (error) => {
      ToastUtils.error({
        title: "Logout Error",
        description: error.message as string,
      });
      throw error;
    },
  });

  const loginCustomer = async (id: string) => {
    await loginCustomerMutation.mutateAsync(id);
  };

  const loginStaff = async (username: string, password: string) => {
    await loginStaffMutation.mutateAsync({ username, password });
  };

  const logout = async (showDefaultLogoutToast = true) => {
    await logoutMutation.mutateAsync(showDefaultLogoutToast);
  };

  useInactivityTimer({
    onInactive: () => {
      logout(false);
      ToastUtils.info({
        title: "Automatic Logout",
        description: "You have been logged out due to inactivity.",
      });
    },
    inactivityTimeout: 6000,
    isActive: isCustomer.current,
  });

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        isError,
        loginCustomer,
        loginStaff,
        logout,
        refreshCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
