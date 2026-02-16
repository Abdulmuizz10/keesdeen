import {
  AccessFailure,
  AccessStart,
  AccessSuccess,
  Logout,
} from "./AuthActions";
import { Dispatch } from "react";
import { toast } from "sonner";
import axiosInstance from "../../lib/axiosConfig";

/**
 * Helper function to merge guest orders after successful authentication
 */
const mergeGuestOrdersIfNeeded = async (
  guestEmail: string,
  setGuestEmail: (email: string) => void,
): Promise<void> => {
  if (!guestEmail || guestEmail.trim() === "") {
    return;
  }

  try {
    const mergeRes = await axiosInstance.post(
      `/orders/merge-guest-orders`,
      { guestEmail },
      {
        validateStatus: (status: any) => status < 600,
      },
    );

    if (mergeRes.status === 200) {
      // console.log(`Guest orders merged: ${mergeRes.data.mergedCount} order(s)`);
      // Clear the guest email after successful merge
      setGuestEmail("");
    } else {
      console.error("Failed to merge guest orders:", mergeRes.data.message);
    }
  } catch (error) {
    // Still clear the guest email to avoid retry loops
    setGuestEmail("");
  }
};

export const SignInAccount = async (
  user: any,
  dispatch: Dispatch<any>,
  navigate: any,
  cartData: any,
  guestEmail: string,
  setGuestEmail: (email: string) => void,
  setLoading: any,
): Promise<void> => {
  dispatch(AccessStart());
  try {
    const res = await axiosInstance.post(`/auth/sign-in`, user, {
      validateStatus: (status: any) => status < 600,
    });

    if (res.status === 200) {
      dispatch(AccessSuccess(res.data));
      // Merge guest orders after successful sign in
      await mergeGuestOrdersIfNeeded(guestEmail, setGuestEmail);
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
  guestEmail: string,
  setGuestEmail: (email: string) => void,
  setLoading: any,
): Promise<void> => {
  dispatch(AccessStart());
  try {
    const res = await axiosInstance.post(`/auth/sign-up`, user, {
      validateStatus: (status: any) => status < 600,
    });

    if (res.status === 200) {
      dispatch(AccessSuccess(res.data));
      // Merge guest orders after successful sign up
      await mergeGuestOrdersIfNeeded(guestEmail, setGuestEmail);
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
  setLoading: any,
): Promise<void> => {
  setLoading(true);
  try {
    const res = await axiosInstance.post(
      `/auth/logout`,
      {},
      {
        validateStatus: (status: any) => status < 600,
      },
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
