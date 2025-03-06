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

export default function CfoNavbar() {
  const auth = useAuth();
  const navigate = useNavigate();

  const logout = () => {
    auth?.logout();
    navigate("/");
  };

  return (
    <nav className="flex justify-between fixed w-screen items-center px-16 py-4 shadow-md bg-white">
      <div className="flex items-center gap-14">
        <div className="text-3xl font-bold">
          VorteKia <span className="text-xs font-normal">CFO</span>
        </div>{" "}
        <NavigationMenu>
          <NavigationMenuList className="flex space-x-4">
            <NavigationMenuItem>
              <a
                href="/cfo/dashboard"
                className="px-4 py-2 hover:bg-gray-200 rounded-md"
              >
                Dashboard
              </a>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <a
                href="/cfo/view-restaurant-proposals"
                className="px-4 py-2 hover:bg-gray-200 rounded-md"
              >
                View Restaurant Proposals
              </a>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <a
                href="/cfo/view-restaurant-transactions"
                className="px-4 py-2 hover:bg-gray-200 rounded-md"
              >
                Restaurant Transactions
              </a>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <a
                href="/cfo/view-store-transactions"
                className="px-4 py-2 hover:bg-gray-200 rounded-md"
              >
                Store Transactions
              </a>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <a
                href="/cfo/view-ride-transactions"
                className="px-4 py-2 hover:bg-gray-200 rounded-md"
              >
                Ride Transactions
              </a>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <a
                href="/chat"
                className="px-4 py-2 hover:bg-gray-200 rounded-md"
              >
                Chat
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
