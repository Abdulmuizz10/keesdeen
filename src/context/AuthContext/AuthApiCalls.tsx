import axios from "axios";
import { AccessFailure, AccessStart, AccessSuccess } from "./AuthActions";
import { Dispatch } from "react";

// Define the structure of the user object

// Define the structure of the Axios response
interface Response {
  data: any; // Replace `any` with the actual data structure if known
}

const URL = "http://localhost:5000/auth";

// Type definition for the login function
export const Login = async (
  user: any,
  dispatch: Dispatch<any>,
  navigate: any
): Promise<void> => {
  dispatch(AccessStart());
  try {
    const res: Response = await axios.post(`${URL}/sign-in`, user);
    dispatch(AccessSuccess(res.data));
    navigate("/");
  } catch (err) {
    dispatch(AccessFailure());
  }
};

export const SignUp = async (
  user: any,
  dispatch: Dispatch<any>,
  navigate: any
): Promise<void> => {
  dispatch(AccessStart());
  try {
    const res: Response = await axios.post(`${URL}/sign-up`, user);
    dispatch(AccessSuccess(res.data));
    navigate("/");
  } catch (err) {
    dispatch(AccessFailure());
  }
};
