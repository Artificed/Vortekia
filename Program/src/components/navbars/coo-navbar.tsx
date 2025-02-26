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
} from "@/components/ui/navigation-menu";

export default function CooNavbar() {
  const auth = useAuth();

  return (
    <nav className="flex justify-between fixed w-screen items-center px-16 py-4 shadow-md bg-white">
      <div className="flex items-center gap-14">
        <div className="text-3xl font-bold">VorteKia</div>

        <NavigationMenu>
          <NavigationMenuList className="flex space-x-4">
            <NavigationMenuItem>
              <a
                href="/coo/dashboard"
                className="px-4 py-2 hover:bg-gray-200 rounded-md"
              >
                Dashboard
              </a>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <a
                href="/coo/create-staff-account"
                className="px-4 py-2 hover:bg-gray-200 rounded-md"
              >
                Create Staff Account
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
