import { ToastUtils } from "@/components/utils/toast-helper";
import Customer from "@/lib/interfaces/entities/customer";
import Staff from "@/lib/interfaces/entities/staff";
import { invoke } from "@tauri-apps/api/core";
import { createContext, ReactNode, useState } from "react";

type User = Staff | Customer;

type AuthContextType = {
  user: Staff | Customer | null;
  logout: () => Promise<void>;
  refreshCurrentUser: () => Promise<void>;
  loginCustomer: (id: string) => Promise<void>;
  loginStaff: (username: string, password: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const loginCustomer = async (id: string) => {
    try {
      await invoke("login_customer", { id });
      await refreshCurrentUser();
      ToastUtils.success({
        title: "Login Success",
        description: "Successfully logged in!",
      });
    } catch (error) {
      ToastUtils.error({
        title: "Login Error",
        description: error as string,
      });
      throw error;
    }
  };

  const loginStaff = async (username: string, password: string) => {
    try {
      await invoke("login_staff", { username, password });
      await refreshCurrentUser();
      ToastUtils.success({
        title: "Login Success",
        description: "Successfully logged in!",
      });
    } catch (error) {
      ToastUtils.error({
        title: "Login Error",
        description: error as string,
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await invoke("logout_user");
      await refreshCurrentUser();
      ToastUtils.info({
        title: "Logged Out",
        description: "You have been logged out successfully.",
      });
    } catch (error) {
      ToastUtils.error({
        title: "Logout Error",
        description: error as string,
      });
      throw error;
    }
  };

  const refreshCurrentUser = async () => {
    try {
      const currentUser = await invoke<any>("get_current_user");
      if (Object.keys(currentUser)[0] === "Customer") {
        setUser(currentUser.Customer as Customer);
      } else if (Object.keys(currentUser)[0] === "Staff") {
        setUser(currentUser.Staff as Staff);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
      ToastUtils.error({
        title: "Authentication Error",
        description: "Failed to retrieve user information.",
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loginCustomer, loginStaff, logout, refreshCurrentUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
