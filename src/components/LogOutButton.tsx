import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext/AuthContext";
import { Button } from "@relume_io/relume-ui";
import { useShop } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";
import { LogOut } from "../context/AuthContext/AuthApiCalls";

const LogOutButton: React.FC = () => {
  const { setCartItems, setWishLists } = useShop();
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    LogOut(setCartItems, setWishLists, navigate, dispatch);
  };

  return (
    <Button
      className="bg-brand-neutral text-white rounded-md py-3 px-18 max-sm:w-full text-base poppins"
      onClick={() => handleLogout()}
    >
      Log out
    </Button>
  );
};

export default LogOutButton;
