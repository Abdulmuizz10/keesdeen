// Define action types

import { OrderState, OrderAction } from "../../lib/types";

// Define the reducer function with types

const OrderReducer = (state: OrderState, action: OrderAction): OrderState => {
  const startFetching = (state: OrderState) => ({
    ...state,
    isFetching: true,
    error: false,
  });

  const fetchFailure = (state: OrderState) => ({
    ...state,
    isFetching: false,
    error: true,
  });

  switch (action.type) {
    case "GET_ORDERS_START":
    case "GET_ORDER_START":
    case "CREATE_ORDER_START":
    case "UPDATE_ORDER_TO_DELIVERED_START":
    case "LINK_GUEST_ORDERS_START":
    case "GET_PROFILE_ORDERS_START":
    case "GET_ORDERS_BY_GUEST_START":
      return startFetching(state);

    case "GET_ORDERS_SUCCESS":
      return {
        ...state,
        orders: action.payload,
        isFetching: false,
        error: false,
      };

    case "GET_ORDER_SUCCESS":
      return {
        ...state,
        order: action.payload,
        isFetching: false,
        error: false,
      };

    case "CREATE_ORDER_SUCCESS":
      return {
        ...state,
        orders: [...state.orders, action.payload],
        isFetching: false,
        error: false,
      };

    case "UPDATE_ORDER_TO_DELIVERED_SUCCESS":
      return {
        ...state,
        orders: state.orders.map((order: any) =>
          order._id === action.payload._id ? action.payload : order
        ),
        isFetching: false,
        error: false,
      };

    case "LINK_GUEST_ORDERS_SUCCESS":
      return {
        ...state,
        isFetching: false,
        error: false,
      };

    case "GET_PROFILE_ORDERS_SUCCESS":
      return {
        ...state,
        orders: action.payload,
        isFetching: false,
        error: false,
      };

    case "GET_ORDERS_BY_GUEST_SUCCESS":
      return {
        ...state,
        orders: action.payload,
        isFetching: false,
        error: false,
      };

    case "LOGOUT_ORDER":
      return {
        ...state,
        orders: [],
        isFetching: false,
        error: false,
      };

    case "GET_ORDERS_FAILURE":
    case "GET_ORDER_FAILURE":
    case "CREATE_ORDER_FAILURE":
    case "UPDATE_ORDER_TO_DELIVERED_FAILURE":
    case "LINK_GUEST_ORDERS_FAILURE":
    case "GET_PROFILE_ORDERS_FAILURE":
    case "GET_ORDERS_BY_GUEST_FAILURE":
      return fetchFailure(state);

    default:
      return state;
  }
};

export default OrderReducer;
export type { OrderAction };
