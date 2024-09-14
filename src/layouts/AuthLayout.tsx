import React, { ReactNode } from "react";

interface AuthLayout {
  children: ReactNode; // Define children as part of the props
}

const AuthLayout: React.FC<AuthLayout> = ({ children }) => {
  return <main>{children}</main>;
};

export default AuthLayout;
