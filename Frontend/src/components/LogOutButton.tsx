import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext/AuthContext";
import { Button } from "@relume_io/relume-ui";
import { useShop } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";
import { LogOut } from "../context/AuthContext/AuthApiCalls";
import Spinner from "./Spinner";

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
        className="bg-brand-neutral text-white rounded-md py-3 px-10 max-sm:w-full text-base poppins"
        onClick={() => handleLogout()}
      >
        Log out
      </Button>
    </>
  );
};

export default LogOutButton;
