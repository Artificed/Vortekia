import Customer from "@/lib/interfaces/entities/customer";
import Staff from "@/lib/interfaces/entities/staff";
import { invoke } from "@tauri-apps/api/core";
import { createContext, ReactNode, useState } from "react";

type User = Staff | Customer;

type AuthContextType = {
  user: Staff | Customer | null;

  logout: () => Promise<string | null>;
  refreshCurrentUser: () => Promise<string | null>;

  loginCustomer: (id: string) => Promise<string | null>;
  loginStaff: (username: string, password: string) => Promise<string | null>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const loginCustomer = async (id: string) => {
    try {
      await invoke("login_customer", { id });
      await refreshCurrentUser();
      return null;
    } catch (error) {
      return error as string;
    }
  };

  const loginStaff = async (username: string, password: string) => {
    try {
      await invoke("login_staff", { username, password });
      await refreshCurrentUser();
      return null;
    } catch (error) {
      return error as string;
    }
  };

  const logout = async () => {
    try {
      await invoke("logout_user");
      await refreshCurrentUser();
      return null;
    } catch (error) {
      return error as string;
    }
  };

  const refreshCurrentUser = async () => {
    try {
      const currentUser = await invoke<any>("get_current_user");
      console.log(currentUser);
      return null;
    } catch (error) {
      return error as string;
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
