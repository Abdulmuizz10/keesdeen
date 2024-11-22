import React, { useEffect } from "react";
import Spinner from "../../components/Spinner";
import { formatAmount } from "../../lib/utils";
import { useOrders } from "../../context/OrderContext/OrderContext";
import { useShop } from "../../context/ShopContext";
import {
  getGuestOrders,
  getProfileOrders,
} from "../../context/OrderContext/OrderApiCalls";

const OrderHistory: React.FC = () => {
  const { guestEmail } = useShop();
  const { orders, orderDispatch } = useOrders();

  useEffect(() => {
    const fetchOrderHistory = async () => {
      if (guestEmail) {
        getGuestOrders(guestEmail, orderDispatch);
      } else {
        getProfileOrders(orderDispatch);
      }
    };
    fetchOrderHistory();
  }, [orderDispatch, guestEmail]);

  return (
    <section id="relume" className="px-[5%] py-24 md:py-30">
      <div className="container">
        <div className="rb-12 mb-12 md:mb-5">
          <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl bricolage-grotesque">
            Order History
          </h2>

          <div className="mt-12 border-t border-border-secondary">
            {/* <h3 className="text-3xl font-semibold mt-8 mb-4 text-text-primary">
              Order History
            </h3> */}
            <div className="space-y-6 mt-8">
              {orders ? (
                orders.length > 0 ? (
                  orders.map((order: any) => (
                    <div
                      key={order.id}
                      className="md:py-26 py-16 px-6 bg-white  border border-gray-200 rounded-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-transform cursor-pointer"
                    >
                      {/* Left Section: Order Info */}
                      <div className="flex flex-col gap-8">
                        <p className="text-lg font-semibold text-gray-800">
                          Order ID:{" "}
                          <span className="font-normal text-gray-600">
                            #{order._id}
                          </span>
                        </p>
                        <div className="text-sm text-gray-500 flex gap-1">
                          <p>{order?.paidAt?.slice(0, 10)}</p>
                          <p>{order?.paidAt?.slice(11, 19)}</p>
                        </div>
                        <div className="hidden sm:flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-medium text-gray-700">
                            Items:
                          </p>
                          <div className="flex items-center gap-2 flex-wrap">
                            {order.orderedItems.map((i: any, index: number) => (
                              <span
                                key={index}
                                className="px-3 py-2 bg-gray-100 text-gray-600 rounded-sm text-sm"
                              >
                                {i.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      {/* Right Section: Order Summary */}
                      <div className="flex flex-col gap-3 text-start sm:text-end">
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            Total:
                          </p>
                          <p className="text-xl font-bold text-green-600">
                            {formatAmount(order.totalPrice)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            Status:
                          </p>
                          <p
                            className={`text-sm font-semibold ${
                              order.isDelivered
                                ? "text-brand-primary"
                                : "text-brand-secondary"
                            }`}
                          >
                            {order.isDelivered ? "Processed" : "Pending"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500">
                    No order history available.
                  </p>
                )
              ) : (
                <div className="w-full flex justify-center">
                  <Spinner />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderHistory;
