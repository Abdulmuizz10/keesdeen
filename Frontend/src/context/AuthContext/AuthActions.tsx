import { AuthAction } from "../../lib/types";

// Action for login start
export const AccessStart = (): AuthAction => ({
  type: "ACCESS_START",
});

// Action for login success with a typed user parameter
export const AccessSuccess = (user: any): AuthAction => ({
  type: "ACCESS_SUCCESS",
  payload: user,
});

// Action for login failure
export const AccessFailure = (): AuthAction => ({
  type: "ACCESS_FAILURE",
});

// Action for logout
export const Logout = (): AuthAction => ({
  type: "LOGOUT",
});
