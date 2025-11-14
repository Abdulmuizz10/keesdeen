import {
  BarChart3,
  Package,
  Users,
  Settings,
  User,
  LogOut,
  Plus,
  ChevronDown,
  ChevronUp,
  Tag,
  ClipboardList,
  PackageCheck,
  Mail,
  Send,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "./ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { mainLogo, mainLogoWhite, fvIcon, fvIconWhite } from "@/assets";
import { useTheme } from "./theme-provider";
import { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthContext/AuthContext";
import { useShop } from "@/context/ShopContext";
import { LogOutAccount } from "@/context/AuthContext/AuthApiCalls";

const AppSidebar = () => {
  const { user, dispatch } = useContext(AuthContext);
  const { setCartItems, setWishLists } = useShop();
  const [_, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    LogOutAccount(setCartItems, setWishLists, navigate, dispatch, setLoading);
  };

  const { theme } = useTheme();
  const show = theme === "dark";

  return (
    <Sidebar collapsible="icon">
      {/* ===== HEADER ===== */}
      <SidebarHeader className="py-5">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/" className="flex items-center justify-start">
                <img
                  src={show ? mainLogoWhite : mainLogo}
                  alt="logo"
                  className="h-10 w-auto group-data-[collapsible=icon]:hidden"
                />
                <img
                  src={show ? fvIconWhite : fvIcon}
                  alt="logo icon"
                  className="h-auto w-auto hidden group-data-[collapsible=icon]:flex"
                />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator />

      {/* ===== CONTENT ===== */}
      <SidebarContent>
        {/* === DASHBOARD === */}
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/admin">
                    <BarChart3 />
                    <span>Analytics</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/admin/transactions">
                    <ArrowLeftRight />
                    <span>New Transactions</span>
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuBadge>+24</SidebarMenuBadge>
              </SidebarMenuItem> */}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* === ORDERS COLLAPSIBLE === */}
        <Collapsible className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger>
                Orders
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/admin/orders">
                        <ClipboardList />
                        All Orders
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/admin/orders/pending">
                        <Package />
                        Pending
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/admin/orders/delivered">
                        <PackageCheck />
                        Delivered
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        {/* === PRODUCTS === */}
        <SidebarGroup>
          <SidebarGroupLabel>Products</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/admin/products">
                    <Package />
                    All Products
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuBadge>44</SidebarMenuBadge>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/admin/products/add">
                    <Plus />
                    Add Product
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* === CUSTOMERS === */}
        <SidebarGroup>
          <SidebarGroupLabel>Customers</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/admin/customers">
                    <Users />
                    <span>Customers</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/admin/subscribers">
                    <Mail />
                    <span>Subscribers</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* === COUPONS === */}
        <SidebarGroup>
          <SidebarGroupLabel>Marketing</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/admin/coupons">
                    <Tag />
                    <span>Coupons</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/admin/coupons">
                    <Send />
                    <span>Send Mails</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ===== FOOTER ===== */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User /> {user.firstName}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <Link to="/profile">
                  <DropdownMenuItem>
                    <User className="h-[1.2rem] w-[1.2rem] mr-2" />
                    Profile
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem>
                  <Settings className="h-[1.2rem] w-[1.2rem] mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLogout()}>
                  <LogOut className="h-[1.2rem] w-[1.2rem] mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
