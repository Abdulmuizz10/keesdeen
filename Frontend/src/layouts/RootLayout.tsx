import React, { useContext, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer1 } from "../components/Footer";
import SearchModal from "../components/SearchModal";
import { User } from "lucide-react";
import { useShop } from "../context/ShopContext";
import { AuthContext } from "../context/AuthContext/AuthContext";

interface RootLayoutProps {
  children?: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  const { isActive, setIsActive } = useShop();
  const { user } = useContext(AuthContext);
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
      {user ? (
        <Link
          to="/profile"
          className=" fixed bottom-[6%] sm:bottom-[8%] right-[5%] sm:right-[1%] flex sm:hidden items-center justify-center bg-brand-primary p-3 rounded-full"
        >
          <User width={20} height={20} className="text-white cursor-pointer" />
        </Link>
      ) : (
        <Link
          to="/auth/sign_in"
          className=" fixed bottom-[6%] sm:bottom-[8%] right-[5%] sm:right-[1%] flex sm:hidden items-center justify-center bg-brand-primary p-3 rounded-full"
        >
          <User width={20} height={20} className="text-white cursor-pointer" />
        </Link>
      )}
      <Footer1 />
    </main>
  );
};

export default RootLayout;
