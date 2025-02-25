import AuthContext from "@/context/auth-context";

import { useContext } from "react";

export default function useAuth() {
  return useContext(AuthContext);
}
