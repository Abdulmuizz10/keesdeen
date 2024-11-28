import axios from "axios";
import { AccessFailure, AccessStart, AccessSuccess } from "./AuthActions";
import { Dispatch } from "react";
import { URL } from "../../lib/constants";

import { toast } from "react-toastify";

interface Response {
  data: any; // Replace `any` with the actual data structure if known
}

// Type definition for the login function
export const Login = async (
  user: any,
  dispatch: Dispatch<any>,
  navigate: any
): Promise<void> => {
  dispatch(AccessStart());
  try {
    const res: Response = await axios.post(`${URL}/auth/sign-in`, user);
    dispatch(AccessSuccess(res.data));
    navigate("/");
  } catch (error) {
    dispatch(AccessFailure());
  }
};

export const SignUp = async (
  user: any,
  dispatch: Dispatch<any>,
  navigate: any,
  guestEmail: any,
  setGuestEmail: any
): Promise<void> => {
  dispatch(AccessStart());
  try {
    const res: Response = await axios.post(`${URL}/auth/sign-up`, user);
    dispatch(AccessSuccess(res.data));
    if (res.data) {
      if (guestEmail) {
        const user = res.data.id;
        const email = guestEmail;
        const userInfo = { user, email };
        const expect = await axios.post(
          `${URL}/orders/linkguest/orders`,
          userInfo
        );
        if (expect) {
          setGuestEmail("");
          toast(expect.data.message);
        }
      }
    }
    navigate("/");
  } catch (err) {
    dispatch(AccessFailure());
  }
};
