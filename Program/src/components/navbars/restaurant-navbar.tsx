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

export default function RestaurantNavbar() {
  const auth = useAuth();

  return (
    <nav className="flex justify-between fixed w-screen items-center px-16 p-4 shadow-md bg-white">
      <div className="flex items-center gap-14">
        <div className="text-2xl font-bold">VorteKia</div>
        <NavigationMenu>
          <NavigationMenuList className="flex space-x-4">
            <NavigationMenuItem>
              <a
                href="/"
                className="px-4 py-2 hover:bg-gray-200 rounded-md cursor-pointer"
              >
                View Restaurants & Menus
              </a>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <a
                href="/search"
                className="px-4 py-2 hover:bg-gray-200 rounded-md cursor-pointer"
              >
                Search Menu
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
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={auth.logout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <CustomerLogin />
        )}
      </div>
    </nav>
  );
}
