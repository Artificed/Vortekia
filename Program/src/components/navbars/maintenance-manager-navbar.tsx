import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useAuth from "@/hooks/auth/use-auth";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { useNavigate } from "react-router";

export default function MaintenanceManagerNavbar() {
  const auth = useAuth();
  const navigate = useNavigate();

  const logout = () => {
    auth?.logout();
    navigate("/");
  };

  return (
    <nav className="flex justify-between fixed w-screen items-center px-16 py-4 z-10 gap-12 shadow-md bg-white">
      <div className="flex items-center w-screen gap-14">
        <div className="text-3xl font-bold">
          VorteKia
          <span className="text-xs font-normal">Maintenance Manager</span>
        </div>{" "}
        <NavigationMenu>
          <NavigationMenuList className="flex space-x-4">
            <NavigationMenuItem>
              <a
                href="/maintenance-manager/dashboard"
                className="px-4 py-2 hover:bg-gray-200 rounded-md"
              >
                Dashboard
              </a>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <a
                href="/maintenance-manager/manage-logs"
                className="px-4 py-2 hover:bg-gray-200 rounded-md"
              >
                Manage Logs
              </a>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <a
                href="/maintenance-manager/manage-requests"
                className="px-4 py-2 hover:bg-gray-200 rounded-md"
              >
                Manage Requests
              </a>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div>
        {auth?.user ? (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <p className="px-4 py-2 bg-gray-50 hover:bg-gray-200 text-gray-800 text-xl font-medium rounded-md transition">
                {auth.user.username}
              </p>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <p>Not Logged In</p>
        )}
      </div>
    </nav>
  );
}
