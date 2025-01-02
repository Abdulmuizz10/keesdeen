import axios from "axios";
import { URL } from "../../lib/constants";
import { toast } from "react-toastify";
import { showOrderSummary } from "../../components/SweatOrderPopUP";

// Create a new order
export const createOrder = async (
  order: any,
  setPaymentLoader: any,
  setCartItems: any,
  setSelectedCountry: any,
  setSelectedState: any,
  navigate: any
) => {
  try {
    const res = await axios.post(`${URL}/orders`, order, {
      withCredentials: true,
      validateStatus: (status) => status < 600,
    });
    if (res.status === 200) {
      setPaymentLoader(false);
      toast.success("Order placed successfully!");
      showOrderSummary(res.data);
      setCartItems({});
      setSelectedCountry("");
      setSelectedState("");
      navigate("/collections/shop_all");
    } else {
      setPaymentLoader(false);
      toast.error(res.data.message || "Something went wrong please try again");
    }
  } catch (err) {
    setPaymentLoader(false);

    toast.error("An unexpected error occurred. Please try again.");
  }
};
