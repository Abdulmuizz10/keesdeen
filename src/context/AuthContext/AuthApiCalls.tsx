import axios from "axios";
import {
  AccessFailure,
  AccessStart,
  AccessSuccess,
  Logout,
} from "./AuthActions";
import { Dispatch } from "react";
import { URL } from "../../lib/constants";

import { toast } from "react-toastify";

// Type definition for the login function
export const Login = async (
  user: any,
  dispatch: Dispatch<any>,
  navigate: any,
  guestEmail: any,
  setGuestEmail: any,
  setLoading: any
): Promise<void> => {
  dispatch(AccessStart());
  try {
    const res = await axios.post(`${URL}/auth/sign-in`, user, {
      withCredentials: true,
      validateStatus: (status) => status < 600,
    });

    if (res.status === 200) {
      dispatch(AccessSuccess(res.data));
      setLoading(false);
      if (res.data) {
        const user = res.data.id;
        const email = res.data.email;
        const userInfo = { user, email };
        const expect = await axios.post(
          `${URL}/orders/link-guest/orders`,
          userInfo
        );
        if (expect) {
          if (guestEmail) {
            setGuestEmail("");
          }
        }
        navigate("/");
      }
    } else {
      dispatch(AccessFailure());
      setLoading(false);
      toast.error(res.data.message || "Something went wrong");
    }
  } catch (error) {
    dispatch(AccessFailure());
    toast.error("An unexpected error occurred. Please try again.");
  }
};

export const SignUp = async (
  user: any,
  dispatch: Dispatch<any>,
  navigate: any,
  guestEmail: any,
  setGuestEmail: any,
  setLoading: any
): Promise<void> => {
  dispatch(AccessStart());
  try {
    const res = await axios.post(`${URL}/auth/sign-up`, user, {
      withCredentials: true,
      validateStatus: (status) => status < 600,
    });
    if (res.status === 200) {
      dispatch(AccessSuccess(res.data));
      setLoading(false);
      if (res.data) {
        const user = res.data.id;
        const email = res.data.email;
        const userInfo = { user, email };
        const expect = await axios.post(
          `${URL}/orders/link-guest/orders`,
          userInfo
        );
        if (expect) {
          if (guestEmail) {
            setGuestEmail("");
          }
        }
        navigate("/");
      }
    } else {
      dispatch(AccessFailure());
      setLoading(false);
      toast.error(res.data.message || "Something went wrong");
    }
  } catch (err) {
    dispatch(AccessFailure());
    toast.error("An unexpected error occurred. Please try again.");
  }
};

export const LogOut = async (
  setCartItems: any,
  setWishLists: any,
  navigate: any,
  dispatch: Dispatch<any>
): Promise<void> => {
  dispatch(AccessStart());
  try {
    const res = await axios.post(`${URL}/auth/logout`, {
      withCredentials: true,
      validateStatus: (status: any) => status < 600,
    });
    if (res.status === 200) {
      dispatch(Logout());
      setCartItems({});
      setWishLists([]);
      navigate("/");
      toast.success(res.data.message);
    } else {
      toast.error(res.data.message);
    }
  } catch (err) {
    dispatch(AccessFailure());
    toast.error("An unexpected error occurred. Please try again.");
  }
};
