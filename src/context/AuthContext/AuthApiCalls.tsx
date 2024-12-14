import axios from "axios";
import { AccessFailure, AccessStart, AccessSuccess } from "./AuthActions";
import { Dispatch } from "react";
import { URL } from "../../lib/constants";

import { toast } from "react-toastify";

// Type definition for the login function
export const Login = async (
  user: any,
  dispatch: Dispatch<any>,
  navigate: any
): Promise<void> => {
  dispatch(AccessStart());
  try {
    const res = await axios.post(`${URL}/auth/sign-in`, user, {
      validateStatus: (status) => status < 600,
    });

    if (res.status === 200) {
      dispatch(AccessSuccess(res.data));
      navigate("/");
      //  setGuestEmail("");
    } else {
      dispatch(AccessFailure());
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
  setGuestEmail: any
): Promise<void> => {
  dispatch(AccessStart());
  try {
    const res = await axios.post(`${URL}/auth/sign-up`, user, {
      validateStatus: (status) => status < 600,
    });
    if (res.status === 200) {
      dispatch(AccessSuccess(res.data));
      if (res.data) {
        const user = res.data.id;
        const email = res.data.email;
        const userInfo = { user, email };
        const expect = await axios.post(
          `${URL}/orders/link-guest/orders`,
          userInfo
        );
        if (expect) {
          setGuestEmail("");
        }
      }
      navigate("/");
    } else {
      dispatch(AccessFailure());
      toast.error(res.data.message || "Something went wrong");
    }
  } catch (err) {
    dispatch(AccessFailure());
    toast.error("An unexpected error occurred. Please try again.");
  }
};
