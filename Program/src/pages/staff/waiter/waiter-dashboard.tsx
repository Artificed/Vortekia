import useAuth from "@/hooks/auth/use-auth";
import { useGetRestaurantTransactionsByStatus } from "@/hooks/data/use-get-restaurant-transactions-by-status";
import { useGetStaffAssignedRestaurant } from "@/hooks/data/use-get-staff-assigned-restaurant";
import { useEffect } from "react";

export default function WaiterDashboard() {
  const auth = useAuth();
  const { assignedRestaurant } = useGetStaffAssignedRestaurant(
    auth?.user?.id || "",
  );
  const { restaurantTransactions: pendingRestaurantTransactions } =
    useGetRestaurantTransactionsByStatus(
      assignedRestaurant?.id ?? "",
      "Pending",
    );

  useEffect(() => {
    console.log(assignedRestaurant);
    console.log(pendingRestaurantTransactions);
  });

  return (
    <>
      <h1>WaiterDashboard</h1>
    </>
  );
}
