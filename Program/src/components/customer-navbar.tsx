import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

export default function CustomerNavbar() {
  const [user, setUser] = useState("");

  return (
    <nav className="flex justify-between fixed w-screen items-center p-4 shadow-md bg-white">
      <div className="text-xl font-bold">VorteKia</div>
      <div>
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <p>{user}</p>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => alert("Profile")}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setUser("")}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button onClick={() => setUser("John Doe")}>Login</Button>
        )}
      </div>
    </nav>
  );
}
