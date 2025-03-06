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
      const role = staff.role.toLowerCase(); // Convert role to lowercase

      switch (role) {
        case "ceo":
        case "cfo":
        case "coo":
          category = "executive";
          break;
        case "maintenance manager":
        case "maintenance staff":
          category = "care_and_maintenance";
          break;
        case "fnb supervisor":
        case "chef":
        case "waiter":
          category = "consumption";
          break;
        case "retail manager":
        case "sales associate":
          category = "marketing";
          break;
        case "ride staff":
        case "ride manager":
          category = "operation";
          break;
        case "lost and found staff":
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
