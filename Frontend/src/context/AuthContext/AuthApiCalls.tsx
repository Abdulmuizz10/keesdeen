import {
  AccessFailure,
  AccessStart,
  AccessSuccess,
  Logout,
} from "./AuthActions";
import { Dispatch } from "react";
import { toast } from "sonner";
import axios from "axios";
import { URL } from "@/lib/constants";

export const SignInAccount = async (
  user: any,
  dispatch: Dispatch<any>,
  navigate: any,
  setLoading: any
): Promise<void> => {
  dispatch(AccessStart());
  try {
    const res = await axios.post(`${URL}/auth/sign-in`, user, {
      validateStatus: (status: any) => status < 600,
      withCredentials: true,
    });

    if (res.status === 200) {
      dispatch(AccessSuccess(res.data));
      navigate("/");
      setLoading(false);
    } else {
      dispatch(AccessFailure());
      setLoading(false);
      toast.error(res.data.message || "Something went wrong");
    }
  } catch (error) {
    dispatch(AccessFailure());
    setLoading(false);
    toast.error("An unexpected error occurred. Please try again.");
  }
};

export const SignUpAccount = async (
  user: any,
  dispatch: Dispatch<any>,
  navigate: any,
  cartData: any,
  setLoading: any
): Promise<void> => {
  dispatch(AccessStart());
  try {
    const res = await axios.post(`${URL}/auth/sign-up`, user, {
      validateStatus: (status: any) => status < 600,
      withCredentials: true,
    });

    if (res.status === 200) {
      dispatch(AccessSuccess(res.data));
      if (cartData.length > 0) {
        navigate("/check_out");
      } else {
        navigate("/");
      }
      setLoading(false);
    } else {
      dispatch(AccessFailure());
      setLoading(false);
      toast.error(res.data.message || "Something went wrong");
    }
  } catch (err) {
    dispatch(AccessFailure());
    setLoading(false);
    toast.error("An unexpected error occurred. Please try again.");
  }
};

export const LogOutAccount = async (
  setCartItems: any,
  setWishLists: any,
  navigate: any,
  dispatch: Dispatch<any>,
  setLoading: any
): Promise<void> => {
  setLoading(true);
  try {
    const res = await axios.post(
      `${URL}/auth/logout`,
      {},
      {
        validateStatus: (status: any) => status < 600,
        withCredentials: true,
      }
    );

    if (res.status === 200) {
      dispatch(Logout());
      setCartItems({});
      setWishLists([]);
      setLoading(false);
      navigate("/");
      toast.success(res.data.message);
    } else {
      setLoading(false);
      toast.error(res.data.message);
    }
  } catch (err) {
    setLoading(false);
    toast.error("An unexpected error occurred. Please try again.");
  }
};
