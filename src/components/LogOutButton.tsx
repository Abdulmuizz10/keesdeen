import React, { useContext } from "react";
import { Logout } from "../context/AuthContext/AuthActions";
import { AuthContext } from "../context/AuthContext/AuthContext";
import { orderLogout } from "../context/OrderContext/OrderAction";
import { Button } from "@relume_io/relume-ui";
import { useShop } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";
import { useOrders } from "../context/OrderContext/OrderContext";

const LogOutButton: React.FC = () => {
  const { setCartItems, setWishLists } = useShop();
  const { dispatch } = useContext(AuthContext);
  const { orderDispatch } = useOrders();
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(Logout());
    setCartItems({});
    setWishLists([]);
    orderDispatch(orderLogout());
    navigate("/");
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
