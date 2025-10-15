import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { Navbar7 } from "../components/Navbar";
import { Footer1 } from "../components/Footer";
import SearchModal from "../components/SearchModal";
import { Truck } from "lucide-react";
import { useShop } from "../context/ShopContext";

interface RootLayoutProps {
  children?: React.ReactNode;
  animation: Boolean;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children, animation }) => {
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
      <div className={`${isActive && "hidden transition-[1s]"}`}>
        <div className={`${animation ? "opacity-0" : " opacity-100"}`}>
          <Navbar7 />
          {children}
          <Outlet />
          <Link
            to="order_history"
            className="fixed bottom-[6%] sm:bottom-[8%] right-[5%] sm:right-[1%] flex items-center justify-center bg-brand-primary p-3 rounded-full"
          >
            <Truck
              width={20}
              height={20}
              className="text-white cursor-pointer"
            />
          </Link>
          <Footer1 />
        </div>
      </div>
    </main>
  );
};

export default RootLayout;
