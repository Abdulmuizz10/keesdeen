import {
  createContext,
  useEffect,
  useReducer,
  ReactNode,
  Dispatch,
} from "react";
import AuthReducer from "./AuthReducer";

// Define the structure of the state
interface AuthState {
  user: any | null;
  isFetching: boolean;
  error: boolean;
}

// Define the initial state
const INITIAL_STATE: AuthState = {
  user: JSON.parse(localStorage.getItem("user") || "null"),
  isFetching: false,
  error: false,
};

// Define the context structure
interface AuthContextProps extends AuthState {
  dispatch: Dispatch<any>;
}

// Create the context with initial values
export const AuthContext = createContext<AuthContextProps>({
  ...INITIAL_STATE,
  dispatch: () => null,
});

// Define the provider component's props
interface AuthContextProviderProps {
  children: ReactNode;
}

// AuthContextProvider in TypeScript
export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(state.user));
  }, [state.user]);

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
