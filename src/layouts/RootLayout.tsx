import React, { ReactNode } from "react";

interface RootLayoutProps {
  children: ReactNode; // Define children as part of the props
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return <main>{children}</main>;
};

export default RootLayout;
