import { useEffect, useState } from "react";
import Staff from "@/lib/interfaces/entities/staff";
import useAuth from "../auth/use-auth";
import { invoke } from "@tauri-apps/api/core";

export function useGetAllowedChats() {
  const auth = useAuth();
  const [allowedChats, setAllowedChats] = useState<string[]>([]);

  useEffect(() => {
    const fetchAllowedChats = async () => {
      const staff = auth?.user as Staff;

      if (!staff || !staff.role) {
        setAllowedChats([]);
        return;
      }

      let category = "";

      switch (staff.role) {
        case "CEO":
        case "CFO":
        case "COO":
          category = "executive";
          break;
        case "Maintenance Manager":
        case "Maintenance Staff":
          category = "care_and_maintenance";
          break;
        case "Fnb Supervisor":
        case "Chef":
        case "Waiter":
          category = "consumption";
          break;
        case "Retail Manager":
        case "Sales Associate":
          category = "marketing";
          break;
        case "Ride Staff":
        case "Ride Manager":
          category = "operation";
          break;
        case "Lost and Found Staff":
          category = "lost_and_found";
          break;
        default:
          category = "global_staff";
      }

      try {
        const result: string[] = await invoke("get_chats_by_category", {
          category,
        });
        setAllowedChats(result);
      } catch (error) {
        console.error("Error fetching allowed chats:", error);
        setAllowedChats([]);
      }
    };

    fetchAllowedChats();
  }, [auth?.user]);

  return allowedChats;
}
