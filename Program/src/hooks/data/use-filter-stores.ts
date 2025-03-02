import Store from "@/lib/interfaces/entities/store";
import { useEffect, useState } from "react";

export function useFilterStores(stores: Store[] | undefined) {
  const [filteredStores, setFilteredStores] = useState<Store[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    if (stores) {
      setFilteredStores(stores);
    }
  }, [stores]);

  useEffect(() => {
    if (stores) {
      let filtered = [...stores];

      if (statusFilter !== "all") {
        filtered = filtered.filter((store) => {
          const isOpen = isStoreOpen(store.openingTime, store.closingTime);
          return statusFilter === "open" ? isOpen : !isOpen;
        });
      }

      if (searchTerm.trim() !== "") {
        filtered = filtered.filter((store) =>
          store.name.toLowerCase().includes(searchTerm.toLowerCase()),
        );
      }

      setFilteredStores(filtered);
    }
  }, [stores, searchTerm, statusFilter]);

  return {
    filteredStores,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
  };
}

function isStoreOpen(openingTime: string, closingTime: string): boolean {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  const [openHour, openMinute] = openingTime.split(":").map(Number);
  const [closeHour, closeMinute] = closingTime.split(":").map(Number);

  const currentTimeValue = currentHour * 60 + currentMinute;
  const openTimeValue = openHour * 60 + openMinute;
  const closeTimeValue = closeHour * 60 + closeMinute;

  return (
    currentTimeValue >= openTimeValue && currentTimeValue <= closeTimeValue
  );
}
