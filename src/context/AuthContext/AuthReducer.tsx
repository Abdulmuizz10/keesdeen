import { User } from "../../lib/types";

interface AuthState {
  user: any | null;
  isFetching: boolean;
  error: boolean;
}

type AuthAction =
  | { type: "ACCESS_START" }
  | { type: "ACCESS_SUCCESS"; payload: User }
  | { type: "ACCESS_FAILURE" }
  | { type: "LOGOUT" };

const AuthReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "ACCESS_START":
      return {
        user: null,
        isFetching: true,
        error: false,
      };
    case "ACCESS_SUCCESS":
      return {
        user: action.payload,
        isFetching: false,
        error: false,
      };
    case "ACCESS_FAILURE":
      return {
        user: null,
        isFetching: false,
        error: true,
      };
    case "LOGOUT":
      return {
        user: null,
        isFetching: false,
        error: false,
      };
    default:
      return state;
  }
};

export default AuthReducer;
