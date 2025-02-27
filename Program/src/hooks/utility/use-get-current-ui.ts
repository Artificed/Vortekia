import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

function useGetCurrentUI() {
  return useQuery({
    queryKey: ["currentUI"],
    queryFn: async () => {
      const res = await invoke<string>("get_current_ui");
      return res;
    },
  });
}

export default useGetCurrentUI;
