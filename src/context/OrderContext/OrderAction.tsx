export const getOrdersStart = (): { type: "GET_ORDERS_START" } => ({
  type: "GET_ORDERS_START",
});

export const getOrdersSuccess = (
  orders: any
): { type: "GET_ORDERS_SUCCESS"; payload: any } => ({
  type: "GET_ORDERS_SUCCESS",
  payload: orders,
});

export const getOrdersFailure = (): { type: "GET_ORDERS_FAILURE" } => ({
  type: "GET_ORDERS_FAILURE",
});

export const getOrderStart = (): { type: "GET_ORDER_START" } => ({
  type: "GET_ORDER_START",
});

export const getOrderSuccess = (
  order: any
): { type: "GET_ORDER_SUCCESS"; payload: any } => ({
  type: "GET_ORDER_SUCCESS",
  payload: order,
});

export const getOrderFailure = (): { type: "GET_ORDER_FAILURE" } => ({
  type: "GET_ORDER_FAILURE",
});

export const createOrderStart = (): { type: "CREATE_ORDER_START" } => ({
  type: "CREATE_ORDER_START",
});

export const createOrderSuccess = (
  order: any
): { type: "CREATE_ORDER_SUCCESS"; payload: any } => ({
  type: "CREATE_ORDER_SUCCESS",
  payload: order,
});

export const createOrderFailure = (): {
  type: "CREATE_ORDER_FAILURE";
} => ({
  type: "CREATE_ORDER_FAILURE",
});

export const updateOrderToDeliveredStart = (): {
  type: "UPDATE_ORDER_TO_DELIVERED_START";
} => ({
  type: "UPDATE_ORDER_TO_DELIVERED_START",
});

export const updateOrderToDeliveredSuccess = (
  order: any
): { type: "UPDATE_ORDER_TO_DELIVERED_SUCCESS"; payload: any } => ({
  type: "UPDATE_ORDER_TO_DELIVERED_SUCCESS",
  payload: order,
});

export const updateOrderToDeliveredFailure = (): {
  type: "UPDATE_ORDER_TO_DELIVERED_FAILURE";
} => ({
  type: "UPDATE_ORDER_TO_DELIVERED_FAILURE",
});

export const linkGuestOrdersStart = (): {
  type: "LINK_GUEST_ORDERS_START";
} => ({
  type: "LINK_GUEST_ORDERS_START",
});

export const linkGuestOrdersSuccess = (): {
  type: "LINK_GUEST_ORDERS_SUCCESS";
} => ({
  type: "LINK_GUEST_ORDERS_SUCCESS",
});

export const linkGuestOrdersFailure = (): {
  type: "LINK_GUEST_ORDERS_FAILURE";
} => ({
  type: "LINK_GUEST_ORDERS_FAILURE",
});

export const getProfileOrdersStart = (): {
  type: "GET_PROFILE_ORDERS_START";
} => ({
  type: "GET_PROFILE_ORDERS_START",
});

export const getProfileOrdersSuccess = (
  orders: any
): { type: "GET_PROFILE_ORDERS_SUCCESS"; payload: any } => ({
  type: "GET_PROFILE_ORDERS_SUCCESS",
  payload: orders,
});

export const getProfileOrdersFailure = (): {
  type: "GET_PROFILE_ORDERS_FAILURE";
} => ({
  type: "GET_PROFILE_ORDERS_FAILURE",
});

export const getOrdersByGuestStart = (): {
  type: "GET_ORDERS_BY_GUEST_START";
} => ({
  type: "GET_ORDERS_BY_GUEST_START",
});

export const getOrdersByGuestSuccess = (
  orders: any
): { type: "GET_ORDERS_BY_GUEST_SUCCESS"; payload: any } => ({
  type: "GET_ORDERS_BY_GUEST_SUCCESS",
  payload: orders,
});

export const getOrdersByGuestFailure = (): {
  type: "GET_ORDERS_BY_GUEST_FAILURE";
} => ({
  type: "GET_ORDERS_BY_GUEST_FAILURE",
});

export const orderLogout = (): {
  type: "LOGOUT_ORDER";
} => ({
  type: "LOGOUT_ORDER",
});
