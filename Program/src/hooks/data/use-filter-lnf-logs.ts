import LnfLog from "@/lib/interfaces/entities/lnf-log";
import { useEffect, useState } from "react";

export function useFilterLnfLogs(lnfLogs: LnfLog[] | undefined) {
  const [filteredLogs, setFilteredLogs] = useState<LnfLog[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    if (lnfLogs) {
      setFilteredLogs(lnfLogs);
    }
  }, [lnfLogs]);

  useEffect(() => {
    if (lnfLogs) {
      let filtered = [...lnfLogs];

      if (statusFilter !== "all") {
        filtered = filtered.filter((log) => log.status === statusFilter);
      }

      if (searchTerm.trim() !== "") {
        filtered = filtered.filter((log) =>
          log.name.toLowerCase().includes(searchTerm.toLowerCase()),
        );
      }

      setFilteredLogs(filtered);
    }
  }, [lnfLogs, searchTerm, statusFilter]);

  return {
    filteredLogs,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
  };
}
