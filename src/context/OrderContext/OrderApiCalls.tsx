import axios from "axios";
import {
  getOrdersStart,
  getOrdersSuccess,
  getOrdersFailure,
  getOrderStart,
  getOrderSuccess,
  getOrderFailure,
  createOrderStart,
  createOrderSuccess,
  createOrderFailure,
  updateOrderToDeliveredStart,
  updateOrderToDeliveredSuccess,
  updateOrderToDeliveredFailure,
  linkGuestOrdersStart,
  linkGuestOrdersSuccess,
  linkGuestOrdersFailure,
  getProfileOrdersStart,
  getProfileOrdersSuccess,
  getProfileOrdersFailure,
  getOrdersByGuestStart,
  getOrdersByGuestSuccess,
  getOrdersByGuestFailure,
} from "./OrderAction";
import { Dispatch } from "react";
import { Product } from "../../lib/types";
import { URL } from "../../lib/constants";
import { toast } from "react-toastify";
import { showOrderSummary } from "../../components/SweatOrderPopUP";

type OrderAction =
  | ReturnType<typeof getOrdersStart>
  | ReturnType<typeof getOrdersSuccess>
  | ReturnType<typeof getOrdersFailure>
  | ReturnType<typeof getOrderStart>
  | ReturnType<typeof getOrderSuccess>
  | ReturnType<typeof getOrderFailure>
  | ReturnType<typeof createOrderStart>
  | ReturnType<typeof createOrderSuccess>
  | ReturnType<typeof createOrderFailure>
  | ReturnType<typeof updateOrderToDeliveredStart>
  | ReturnType<typeof updateOrderToDeliveredSuccess>
  | ReturnType<typeof updateOrderToDeliveredFailure>
  | ReturnType<typeof linkGuestOrdersStart>
  | ReturnType<typeof linkGuestOrdersSuccess>
  | ReturnType<typeof linkGuestOrdersFailure>
  | ReturnType<typeof getProfileOrdersStart>
  | ReturnType<typeof getProfileOrdersSuccess>
  | ReturnType<typeof getProfileOrdersFailure>
  | ReturnType<typeof getOrdersByGuestStart>
  | ReturnType<typeof getOrdersByGuestSuccess>
  | ReturnType<typeof getOrdersByGuestFailure>;

// Fetch products
export const getOrders = async (orderDispatch: Dispatch<OrderAction>) => {
  orderDispatch(getOrderStart());
  try {
    const res = await axios.get<Product[]>(`${URL}/orders`, {
      headers: {
        token:
          "Bearer " + JSON.parse(localStorage.getItem("user") || "{}").token,
      },
    });
    orderDispatch(getOrdersSuccess(res.data));
  } catch (err) {
    orderDispatch(getOrdersFailure());
  }
};

export const getOrder = async (
  orderId: string,
  orderDispatch: Dispatch<OrderAction>
) => {
  orderDispatch(getOrderStart());
  try {
    const res = await axios.get<Product>(`${URL}/orders/${orderId}`);
    orderDispatch(getOrderSuccess(res.data));
  } catch (err) {
    orderDispatch(getOrderFailure());
  }
};

// Create a new order
export const createOrder = async (
  order: any,
  orderDispatch: Dispatch<OrderAction>,
  setPaymentLoader: any,
  setCartItems: any,
  setSelectedCountry: any,
  setSelectedState: any,
  navigate: any
) => {
  orderDispatch(createOrderStart());
  try {
    const res = await axios.post<Product>(`${URL}/orders`, order);
    orderDispatch(createOrderSuccess(res.data));
    setPaymentLoader(false);
    toast.success("Order placed successfully!");
    showOrderSummary(res.data);
    setCartItems({});
    setSelectedCountry("");
    setSelectedState("");
    navigate("/collections/shop_all");
  } catch (err) {
    setPaymentLoader(false);
    orderDispatch(createOrderFailure());
    toast.error("Order cannot be placed");
  }
};

// Update an order property to delivered
export const updateOrderToDelivered = async (
  order: any,
  orderDispatch: Dispatch<OrderAction>
) => {
  orderDispatch(updateOrderToDeliveredStart());
  try {
    const res = await axios.put<Product>(
      `${URL}/orders/${order._id}/deliver`,
      order,
      {
        headers: {
          token:
            "Bearer " + JSON.parse(localStorage.getItem("user") || "{}").token,
        },
      }
    );
    orderDispatch(updateOrderToDeliveredSuccess(res.data));
  } catch (err) {
    orderDispatch(updateOrderToDeliveredFailure());
  }
};

export const linkGuestOrders = async (
  userInfo: any,
  orderDispatch: Dispatch<OrderAction>
) => {
  orderDispatch(linkGuestOrdersStart());
  try {
    const res = await axios.post<any>(
      `${URL}/orders/linkguest/orders`,
      userInfo,
      {
        headers: {
          token:
            "Bearer " + JSON.parse(localStorage.getItem("user") || "{}").token,
        },
      }
    );
    orderDispatch(linkGuestOrdersSuccess());
    toast(res.data.message);
  } catch (err) {
    orderDispatch(linkGuestOrdersFailure());
  }
};

// get profile orders
export const getProfileOrders = async (
  orderDispatch: Dispatch<OrderAction>
) => {
  orderDispatch(getProfileOrdersStart());
  try {
    const res = await axios.get(`${URL}/orders/profile/orders`, {
      headers: {
        token:
          "Bearer " + JSON.parse(localStorage.getItem("user") || "{}").token,
      },
    });
    orderDispatch(getProfileOrdersSuccess(res.data));
  } catch (err) {
    orderDispatch(getProfileOrdersFailure());
  }
};

export const getGuestOrders = async (
  guest: any,
  orderDispatch: Dispatch<OrderAction>
) => {
  orderDispatch(getOrdersByGuestStart());
  try {
    const res = await axios.get(`${URL}/orders/guest/orders?guest=${guest}`);
    orderDispatch(getOrdersByGuestSuccess(res.data));
  } catch (err) {
    orderDispatch(getOrdersByGuestFailure());
  }
};
