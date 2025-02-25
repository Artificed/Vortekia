import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CustomerLogin from "./modals/customer-login";
import useAuth from "@/hooks/auth/use-auth";

export default function CustomerNavbar() {
  const auth = useAuth();

  return (
    <nav className="flex justify-between fixed w-screen items-center p-4 shadow-md bg-white">
      <div className="text-xl font-bold">VorteKia</div>
      <div>
        {auth?.user ? (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <p>{auth.user.username}</p>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <CustomerLogin />
        )}
      </div>
    </nav>
  );
}
