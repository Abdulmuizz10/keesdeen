import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Navbar7 } from "../components/Navbar";
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
      <div className={isActive && "hidden transition-[1s]"}>
        <Navbar7 />
        {children}
        <Outlet />
        <Footer1 />
      </div>
    </main>
  );
};

export default RootLayout;
