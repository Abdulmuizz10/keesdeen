import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Footer1 } from "../components/Footer";
import SearchModal from "../components/SearchModal";
import { useShop } from "../context/ShopContext";

interface RootLayoutProps {
  children?: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  const { isActive, setIsActive } = useShop();
  const location = useLocation();

  useEffect(() => {
    if (isActive) {
      setIsActive(!isActive);
    }
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <main>
      <SearchModal />
      <Navbar />
      {children}
      <Outlet />
      <Footer1 />
    </main>
  );
};

export default RootLayout;
