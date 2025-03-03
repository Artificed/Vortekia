import RestaurantDashboard from "@/pages/restaurant/restaurant-dashboard";
import RestaurantDetailPage from "@/pages/restaurant/restaurant-detail";
import { Route, Routes } from "react-router";

export default function RestaurantUI() {
  return (
    <Routes>
      <Route path="/" element={<RestaurantDashboard />} />
      <Route path="/restaurant/:id" element={<RestaurantDetailPage />} />
    </Routes>
  );
}
