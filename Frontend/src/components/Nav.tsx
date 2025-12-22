import { Avatar, AvatarFallback } from "./ui/avatar";
// import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { SidebarTrigger } from "./ui/sidebar";
import { Link, useNavigate } from "react-router-dom";
import { ModeToggle } from "./mode-toggle";
import { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthContext/AuthContext";
import { useShop } from "@/context/ShopContext";
import { LogOutAccount } from "@/context/AuthContext/AuthApiCalls";
import { LogOut, Settings, User } from "lucide-react";
// import CommandMenu from "./CommandMenu";

const Nav = () => {
  const { user, dispatch } = useContext(AuthContext);
  const { setCartItems, setWishLists } = useShop();
  const [_, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    LogOutAccount(setCartItems, setWishLists, navigate, dispatch, setLoading);
  };

  return (
    <nav className="p-4 flex items-center justify-between sticky top-0 bg-background z-10 shadow-xxsmall">
      {/* LEFT */}
      <SidebarTrigger />
      {/* <CommandMenu /> */}

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        <p className="tracking-wide">
          Welcome, <span className="font-bold">{user?.firstName}</span>
        </p>
        {/* THEME MENU */}
        <ModeToggle />
        {/* USER MENU */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarFallback>{user?.firstName.split("")[0]}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent sideOffset={20} className="mr-5">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link to="/profile">
              <DropdownMenuItem>
                <User className="h-[1.2rem] w-[1.2rem] mr-2" />
                Profile
              </DropdownMenuItem>
            </Link>
            <Link to="/admin/settings">
              <DropdownMenuItem>
                <Settings className="h-[1.2rem] w-[1.2rem] mr-2" />
                Settings
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem onClick={() => handleLogout()}>
              <LogOut className="h-[1.2rem] w-[1.2rem] mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Nav;
