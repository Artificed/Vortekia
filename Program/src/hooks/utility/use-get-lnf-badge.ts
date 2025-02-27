export function useGetLnfBadge() {
  const getBadgeColor = (status: string): string => {
    switch (status) {
      case "Missing":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      case "Found":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "Returned To Owner":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  return { getBadgeColor };
}
