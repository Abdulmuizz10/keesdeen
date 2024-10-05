import React from "react";
import { Outlet } from "react-router-dom";
import { Navbar7 } from "../components/Navbar";
import { Footer1 } from "../components/Footer";

interface RootLayoutProps {
  children?: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <main>
      <Navbar7 />
      {children}
      <Outlet /> {/* This renders the nested routes */}
      <Footer1 />
    </main>
  );
};

export default RootLayout;
