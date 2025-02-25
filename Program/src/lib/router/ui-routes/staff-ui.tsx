import StaffLogin from "@/pages/staff/auth/staff-login";
import { Route, Routes } from "react-router";

export default function StaffUI() {
  return (
    <Routes>
      <Route path="/" element={<StaffLogin />} />
    </Routes>
  );
}
