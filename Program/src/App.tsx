import { BrowserRouter as Router } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppRoutes from "./lib/router/app-routes";
import "./app.css";
import { AuthProvider } from "./context/auth-context";
import { ToastProvider } from "./components/utils/toast-helper";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <ToastProvider />
          <AppRoutes />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}
