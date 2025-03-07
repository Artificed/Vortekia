import CustomerDashboard from "@/pages/customer/customer-dashboard";
import CustomerViewAllRestaurants from "@/pages/customer/customer-view-all-restaurants";
import CustomerViewAllRides from "@/pages/customer/customer-view-all-rides";
import CustomerRestaurantDetailPage from "@/pages/customer/customer-view-restaurant-detail";
import CustomerViewRideDetailPage from "@/pages/customer/customer-view-ride-detail-page";
import { Route, Routes } from "react-router";

export default function CustomerUI() {
  return (
    <Routes>
      <Route path="/" element={<CustomerDashboard />} />
      <Route path="/restaurants" element={<CustomerViewAllRestaurants />} />
      <Route path="/rides" element={<CustomerViewAllRides />} />
      <Route
        path="/restaurant/:menuId"
        element={<CustomerRestaurantDetailPage />}
      />
      <Route
        path="/ride-detail/:rideId"
        element={<CustomerViewRideDetailPage />}
      />
    </Routes>
  );
}
