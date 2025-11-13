import React from "react";
import { useShop } from "../context/ShopContext";
import AdminSpinner from "../components/AdminSpinner";
import { Outlet } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSideBar";
import Nav from "@/components/Nav";

interface AdminLayoutProps {
  children?: React.ReactNode;
  animation: Boolean;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, animation }) => {
  const { adminLoader } = useShop();

  return (
    <div className={`${animation ? "hidden" : "block"}`}>
      {adminLoader && <AdminSpinner />}
      <main className="admin">
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <SidebarProvider>
            <AppSidebar />
            <main className="w-full">
              <Nav />
              <div className="overflow-hidden">
                {children}
                <Outlet />
              </div>
            </main>
          </SidebarProvider>
        </ThemeProvider>
      </main>
    </div>
  );
};

export default AdminLayout;
