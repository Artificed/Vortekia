import { ToastUtils } from "@/components/utils/toast-helper";
import Customer from "@/lib/interfaces/entities/customer";
import Staff from "@/lib/interfaces/entities/staff";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";
import { createContext, ReactNode, useCallback } from "react";

type User = Staff | Customer;

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
          return currentUser.Customer as Customer;
        } else if (Object.keys(currentUser)[0] === "Staff") {
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
    onSuccess: async () => {
      await refreshCurrentUser();
      ToastUtils.info({
        title: "Logged Out",
        description: "You have been logged out successfully.",
      });
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

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

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
