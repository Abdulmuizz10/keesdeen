import React from "react";

const AdminSpinner: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-full flex items-center justify-center bg-black/50 z-50">
      <div className="loader"></div>
    </div>
  );
};

export default AdminSpinner;
