import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";

interface AuthLayoutProps {
  children?: React.ReactNode;
  animation: Boolean;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, animation }) => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <main>
      <div className={`${animation ? "opacity-0" : " opacity-100"}`}>
        {children}
        <Outlet />
      </div>
    </main>
  );
};

export default AuthLayout;
