import axios from "axios";
import { URL } from "../../lib/constants";
import { toast } from "sonner";

// Create a new order
export const createOrder = async (
  order: any,
  setLoading: any,
  setCartItems: any,
  navigate: any
) => {
  try {
    const res = await axios.post(`${URL}/orders`, order, {
      withCredentials: true,
      validateStatus: (status) => status < 600,
    });
    if (res.status === 200) {
      setLoading(false);
      toast.success("Order placed successfully!");
      setCartItems({});
      navigate("/collections/shop_all");
    } else {
      setLoading(false);
      toast.error(res.data.message || "Something went wrong please try again");
    }
  } catch (err) {
    setLoading(false);
    toast.error("An unexpected error occurred. Please try again.");
  }
};
