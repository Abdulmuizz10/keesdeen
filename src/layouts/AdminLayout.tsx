import React, { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return <div className="min-h-screen bg-background-light">{children}</div>;
};

export default AdminLayout;
