import CooCreateStaff from "@/pages/staff/coo/coo-create-staff";
import CooDashboard from "@/pages/staff/coo/coo-dashboard";
import CsChat from "@/pages/staff/customer-service/cs-chat";
import CsCreateCustomer from "@/pages/staff/customer-service/cs-create-customer";
import CsDashboard from "@/pages/staff/customer-service/cs-dashboard";
import LnfStaffDashboard from "@/pages/staff/lost-and-found-staff/lnf-staff-dashboard";
import StaffLogin from "@/pages/staff/staff-login";
import { Route, Routes } from "react-router";

export default function StaffUI() {
  return (
    <Routes>
      <Route path="/" element={<StaffLogin />} />

      {/* CS Routes */}
      <Route path="customer-service/dashboard" element={<CsDashboard />} />
      <Route
        path="customer-service/create-customer-account"
        element={<CsCreateCustomer />}
      />
      <Route path="customer-service/chat" element={<CsChat />} />

      {/* COO Routes */}
      <Route path="coo/dashboard" element={<CooDashboard />} />
      <Route path="coo/create-staff-account" element={<CooCreateStaff />} />

      {/* Lost And Found Staff Routes */}
      <Route
        path="lost-and-found-staff/dashboard"
        element={<LnfStaffDashboard />}
      />
    </Routes>
  );
}
