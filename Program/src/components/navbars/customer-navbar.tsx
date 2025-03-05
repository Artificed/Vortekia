import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CustomerLogin from "../modals/customer-login";
import useAuth from "@/hooks/auth/use-auth";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@radix-ui/react-navigation-menu";
import TopUpModal from "../modals/top-up-modal";

export default function CustomerNavbar() {
  const auth = useAuth();
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);

  return (
    <nav className="flex justify-between fixed w-screen items-center px-16 p-4 shadow-md bg-white">
      <div className="flex items-center gap-14">
        <div className="text-3xl font-bold">
          VorteKia <span className="text-xs font-normal">Customer</span>
        </div>{" "}
        {auth?.user && (
          <NavigationMenu>
            <NavigationMenuList className="flex space-x-4">
              <NavigationMenuItem>
                <a
                  onClick={() => setIsTopUpOpen(true)}
                  className="px-4 py-2 hover:bg-gray-200 rounded-md cursor-pointer"
                >
                  Top Up Balance
                </a>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <a className="px-4 py-2 hover:bg-gray-200 rounded-md cursor-pointer">
                  View Stores
                </a>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <a className="px-4 py-2 hover:bg-gray-200 rounded-md cursor-pointer">
                  View Restaurants
                </a>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <a className="px-4 py-2 hover:bg-gray-200 rounded-md cursor-pointer">
                  Customer Service Chat
                </a>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        )}
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
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={auth.logout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <CustomerLogin />
        )}
      </div>

      <TopUpModal isOpen={isTopUpOpen} onClose={() => setIsTopUpOpen(false)} />
    </nav>
  );
}
