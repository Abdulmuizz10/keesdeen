import {
  createContext,
  useEffect,
  useReducer,
  ReactNode,
  Dispatch,
} from "react";
import AuthReducer from "./AuthReducer";
import { Logout } from "./AuthActions";
import { toast } from "sonner";

interface AuthState {
  user: any | null;
  isFetching: boolean;
  error: boolean;
}

const INITIAL_STATE: AuthState = {
  user: JSON.parse(localStorage.getItem("user") || "null"),
  isFetching: false,
  error: false,
};

interface AuthContextProps extends AuthState {
  dispatch: Dispatch<any>;
}

export const AuthContext = createContext<AuthContextProps>({
  ...INITIAL_STATE,
  dispatch: () => null,
});

interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  // Sync user state with localStorage
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(state.user));
  }, [state.user]);

  // Listen for token refresh failures
  useEffect(() => {
    const handleTokenRefreshFailed = () => {
      // Clear user state and redirect to login
      dispatch(Logout());
      localStorage.removeItem("user");
      toast.error("Your session has expired. Please log in again.");

      // Use window.location for navigation (works outside router context)
      window.location.href = "/auth/Sign_in";
    };

    window.addEventListener("token-refresh-failed", handleTokenRefreshFailed);

    return () => {
      window.removeEventListener(
        "token-refresh-failed",
        handleTokenRefreshFailed
      );
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isFetching: state.isFetching,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
