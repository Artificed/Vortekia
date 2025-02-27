import StaffUI from "./ui-routes/staff-ui";
import RideUI from "./ui-routes/ride-ui";
import RestaurantUI from "./ui-routes/restaurant-ui";
import StoreUI from "./ui-routes/store-ui";
import CustomerUI from "./ui-routes/customer-ui";
import useGetCurrentUI from "@/hooks/utility/use-get-current-ui";

export default function AppRoutes() {
  const { isLoading, data } = useGetCurrentUI();

  if (isLoading) {
    return "Loading...";
  }

  if (data == "Staff") {
    return <StaffUI />;
  } else if (data == "Ride") {
    return <RideUI />;
  } else if (data == "Restaurant") {
    return <RestaurantUI />;
  } else if (data == "Store") {
    return <StoreUI />;
  } else if (data == "Customer") {
    return <CustomerUI />;
  }
}
