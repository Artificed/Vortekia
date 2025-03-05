import RideDashboard from "@/pages/ride/ride-dashboard";
import RideDetails from "@/pages/ride/ride-details";
import RideTransactionHistoryPage from "@/pages/ride/ride-transaction-history";
import { Route, Routes } from "react-router";

export default function RideUI() {
  return (
    <Routes>
      <Route path="/" element={<RideDashboard />} />
      <Route path="/ride-detail/:rideId" element={<RideDetails />} />
      <Route path="/history" element={<RideTransactionHistoryPage />} />
    </Routes>
  );
}
