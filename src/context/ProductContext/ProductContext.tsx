import React, {
  createContext,
  useReducer,
  ReactNode,
  Dispatch,
  useContext,
} from "react";
import ProductReducer from "./ProductReducer";

// Define the shape of the product context state
interface ProductState {
  products: any[];
  product: any;
  isFetching: boolean;
  error: boolean;
}

// Define the initial state
const INITIAL_STATE: ProductState = {
  products: [],
  product: {},
  isFetching: false,
  error: false,
};

// Define the context structure
interface ProductContextProps extends ProductState {
  dispatch: Dispatch<any>;
}

// Create the context with a default value of the initial state and a dispatch placeholder
const ProductContext = createContext<ProductContextProps | undefined>({
  ...INITIAL_STATE,
  dispatch: () => null,
});

// Define props for the ProductContextProvider
interface ProductContextProviderProps {
  children: ReactNode;
}

// Define the provider component
export const ProductContextProvider: React.FC<ProductContextProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(ProductReducer, INITIAL_STATE);

  return (
    <ProductContext.Provider
      value={{
        products: state.products,
        product: state.product,
        isFetching: state.isFetching,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ShopProvider");
  }
  return context;
};
