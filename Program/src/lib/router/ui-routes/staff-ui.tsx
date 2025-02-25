import StaffLogin from "@/pages/staff/staff-login";
import { Route, Routes } from "react-router";

export default function StaffUI() {
  return (
    <Routes>
      <Route path="/" element={<StaffLogin />} />
    </Routes>
  );
}
