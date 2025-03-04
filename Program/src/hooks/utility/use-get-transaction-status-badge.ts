import { useCallback } from "react";

export default function useTransactionStatusBadge() {
  const getStatusBadgeColor = useCallback((status: string) => {
    switch (status) {
      case "Completed":
        return "bg-blue-100 text-blue-800";
      case "Ready to Serve":
        return "bg-green-100 text-green-800";
      case "Cooking":
        return "bg-orange-100 text-orange-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }, []);

  return { getStatusBadgeColor };
}
