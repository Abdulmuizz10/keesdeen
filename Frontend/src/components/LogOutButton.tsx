import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext/AuthContext";
import { Button } from "@relume_io/relume-ui";
import { useShop } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";
import { LogOutAccount } from "../context/AuthContext/AuthApiCalls";
import Spinner from "./Spinner";
import { LogOutIcon } from "lucide-react";

const LogOutButton: React.FC = () => {
  const { setCartItems, setWishLists } = useShop();
  const [loading, setLoading] = useState(false);
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    LogOutAccount(setCartItems, setWishLists, navigate, dispatch, setLoading);
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 h-screen w-screen flex items-center justify-center bg-black/50 z-50">
          <Spinner />
        </div>
      )}
      <Button
        className="w-fit border border-gray-900 bg-gray-900 hover:bg-gray-800 py-3 text-sm uppercase tracking-widest text-white transition-colors "
        onClick={() => handleLogout()}
      >
        Log out
        <LogOutIcon width={20} height={20} />
      </Button>
    </>
  );
};

export default LogOutButton;
