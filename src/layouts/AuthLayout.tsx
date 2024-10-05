import React from "react";
import { Outlet } from "react-router-dom";

interface AuthLayoutProps {
  children?: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <main>
      {children}
      <Outlet /> {/* This renders the nested routes */}
    </main>
  );
};

export default AuthLayout;
