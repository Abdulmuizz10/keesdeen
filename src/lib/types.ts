export interface AuthState {
  user: any | null;
  isFetching: boolean;
  error: boolean;
}

export interface User {
  id: string;
  username: string;
  email: string;
  isAdmin: string;
  token: string;
}

export type AuthAction =
  | { type: "ACCESS_START" }
  | { type: "ACCESS_SUCCESS"; payload: User }
  | { type: "ACCESS_FAILURE" }
  | { type: "LOGOUT" };
