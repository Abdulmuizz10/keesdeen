import React, {
  createContext,
  useReducer,
  ReactNode,
  Dispatch,
  useContext,
} from "react";
import OrderReducer from "./OrderReducer";

// Define the shape of the product context state
interface OrderState {
  orders: any;
  order: any;
  isFetching: boolean;
  error: boolean;
}

// Define the initial state
const INITIAL_STATE: OrderState = {
  orders: [],
  order: {},
  isFetching: false,
  error: false,
};

// Define the context structure
interface OrderContextProps extends OrderState {
  orderDispatch: Dispatch<any>;
}

// Create the context with a default value of the initial state and a dispatch placeholder
const OrderContext = createContext<OrderContextProps>({
  ...INITIAL_STATE,
  orderDispatch: () => null,
});

// Define props for the ProductContextProvider
interface OrderContextProviderProps {
  children: ReactNode;
}

// Define the provider component
export const OrderContextProvider: React.FC<OrderContextProviderProps> = ({
  children,
}) => {
  const [state, orderDispatch] = useReducer(OrderReducer, INITIAL_STATE);

  return (
    <OrderContext.Provider
      value={{
        orders: state.orders,
        order: state.order,
        isFetching: state.isFetching,
        error: state.error,
        orderDispatch,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrders must be used within a ShopProvider");
  }
  return context;
};
