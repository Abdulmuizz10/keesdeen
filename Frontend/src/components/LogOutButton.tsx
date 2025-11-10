import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext/AuthContext";
import { Button } from "@relume_io/relume-ui";
import { useShop } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";
import { LogOut } from "../context/AuthContext/AuthApiCalls";
import Spinner from "./Spinner";
import { LogOutIcon } from "lucide-react";

const LogOutButton: React.FC = () => {
  const { setCartItems, setWishLists } = useShop();
  const [loading, setLoading] = useState(false);
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    LogOut(setCartItems, setWishLists, navigate, dispatch, setLoading);
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 h-screen w-screen flex items-center justify-center bg-black/50 z-50">
          <Spinner />
        </div>
      )}
      <Button
        className="w-fit border border-gray-900 bg-gray-900 py-3 text-sm uppercase tracking-widest text-white transition-colors hover:bg-gray-800"
        onClick={() => handleLogout()}
      >
        Log out
        <LogOutIcon className="w-5 h-5" />
      </Button>
    </>
  );
};

export default LogOutButton;
