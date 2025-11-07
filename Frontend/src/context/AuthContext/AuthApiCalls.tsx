import axios from "axios";
import {
  AccessFailure,
  AccessStart,
  AccessSuccess,
  Logout,
} from "./AuthActions";
import { Dispatch } from "react";
import { URL } from "../../lib/constants";
import { toast } from "sonner";

// Type definition for the login function
export const SignInAccount = async (
  user: any,
  dispatch: Dispatch<any>,
  navigate: any,
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
      navigate("/");
      setLoading(false);
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

export const SignUpAccount = async (
  user: any,
  dispatch: Dispatch<any>,
  navigate: any,
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
      navigate("/cart");
      setLoading(false);
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
  dispatch: Dispatch<any>,
  setLoading: any
): Promise<void> => {
  setLoading(true);
  try {
    // Notify the backend (optional)
    const res = await axios.post(`${URL}/auth/logout`, {
      withCredentials: true,
      validateStatus: (status: any) => status < 600,
    });

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
