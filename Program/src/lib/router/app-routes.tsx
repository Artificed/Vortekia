import CustomerDashboard from "@/pages/customer/customer-dashboard";
import { Route, Routes } from "react-router";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<CustomerDashboard />} />
    </Routes>
  );
}
