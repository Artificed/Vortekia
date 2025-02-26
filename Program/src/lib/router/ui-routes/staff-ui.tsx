import CsCreateCustomer from "@/pages/staff/customer-service/cs-create-customer";
import CsDashboard from "@/pages/staff/customer-service/cs-dashboard";
import StaffLogin from "@/pages/staff/staff-login";
import { Route, Routes } from "react-router";

export default function StaffUI() {
  return (
    <Routes>
      <Route path="/" element={<StaffLogin />} />

      <Route path="customer-service/dashboard" element={<CsDashboard />} />
      <Route
        path="customer-service/create-customer-account"
        element={<CsCreateCustomer />}
      />
      <Route path="customer-service/chat" element={<CsDashboard />} />
    </Routes>
  );
}
