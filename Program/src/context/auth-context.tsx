import User from "@/lib/interfaces/entities/user";
import { invoke } from "@tauri-apps/api/core";
import { createContext, ReactNode, useState } from "react";

type AuthContextType = {
  user: User | null;
  register: (
    username: string,
    password: string,
    role: string,
    email: string,
  ) => Promise<string | null>;
  login: (username: string, password: string) => Promise<string | null>;
  logout: () => Promise<string | null>;
  refreshCurrentUser: () => Promise<string | null>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const register = async (
    username: string,
    password: string,
    role: string,
    email: string,
  ) => {
    try {
      await invoke("register_user", { username, password, role, email });
      await refreshCurrentUser();
      return null;
    } catch (error) {
      return error as string;
    }
  };

  const login = async (username: string, password: string) => {
    try {
      await invoke("login_user", { username, password });
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
      const currentUser = await invoke<User | null>("get_current_user");
      setUser(currentUser);
      return null;
    } catch (error) {
      return error as string;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, register, login, logout, refreshCurrentUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
