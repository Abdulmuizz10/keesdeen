import React from "react";
import { useShop } from "../../context/ShopContext";
import Spinner from "../../components/Spinner";
import { formatAmount } from "../../lib/utils";

const OrderHistory: React.FC = () => {
  const { noUserOrderHistory, orderHistory } = useShop();
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
            <div className="space-y-4 mt-8">
              {noUserOrderHistory ? (
                noUserOrderHistory.length > 0 ? (
                  noUserOrderHistory.map((order: any) => (
                    <div
                      key={order.id}
                      className="py-4 border-b border-border-secondary sm:grid sm:grid-cols-[4fr_1fr] flex flex-col sm:items-center "
                    >
                      <div className="flex flex-col gap-2">
                        <p className="text-text-primary font-medium">
                          Order ID: #{order._id}
                        </p>
                        <div className="text-gray-500 text-end">
                          <div className="flex gap-2 items-center">
                            <p className="text-sm text-gray-500 ">
                              {order?.paidAt?.split("").slice(0, 10)}
                            </p>
                            <p className="text-sm text-gray-500 ">
                              {order?.paidAt?.split("").slice(11, 19)}
                            </p>
                          </div>
                        </div>
                        <div className="hidden sm:flex items-center gap-2">
                          <p className="text-text-primary font-medium">
                            Items:
                          </p>
                          <div className="flex items-center gap-2">
                            {order.orderedItems.map((i: any, index: number) => (
                              <p className="text-brand-neutral" key={index}>
                                {i.name},
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="sm:text-end text-start max-md:mt-3">
                        <div className="flex items-center sm:justify-end justify-start gap-2">
                          <p className="font-semibold text-text-primary">
                            Total:
                          </p>
                          <p className="font-semibold text-gray-500">
                            {formatAmount(order.totalPrice)}
                          </p>
                        </div>
                        <div className="flex items-center sm:justify-end justify-start gap-2">
                          <p className="font-semibold text-text-primary">
                            Status:
                          </p>
                          <p className="font-semibold text-gray-500">
                            {order.isDelivered === false
                              ? "Pending"
                              : "Processed"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <></>
                )
              ) : (
                <div className="w-full flex justify-center">
                  <Spinner />
                </div>
              )}
              {orderHistory ? (
                orderHistory.length > 0 ? (
                  orderHistory.map((order: any) => (
                    <div
                      key={order.id}
                      className="py-4 border-b border-border-secondary sm:grid sm:grid-cols-[4fr_1fr] flex flex-col sm:items-center "
                    >
                      <div className="flex flex-col gap-2">
                        <p className="text-text-primary font-medium">
                          Order ID: #{order._id}
                        </p>
                        <div className="text-gray-500 text-end">
                          <div className="flex gap-2 items-center">
                            <p className="text-sm text-gray-500 ">
                              {order?.paidAt?.split("").slice(0, 10)}
                            </p>
                            <p className="text-sm text-gray-500 ">
                              {order?.paidAt?.split("").slice(11, 19)}
                            </p>
                          </div>
                        </div>
                        <div className="hidden sm:flex items-center gap-2">
                          <p className="text-text-primary font-medium">
                            Items:
                          </p>
                          <div className="flex items-center gap-2">
                            {order.orderedItems.map((i: any, index: number) => (
                              <p className="text-brand-neutral" key={index}>
                                {i.name},
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="sm:text-end text-start max-md:mt-3">
                        <div className="flex items-center sm:justify-end justify-start gap-2">
                          <p className="font-semibold text-text-primary">
                            Total:
                          </p>
                          <p className="font-semibold text-gray-500">
                            {formatAmount(order.totalPrice)}
                          </p>
                        </div>
                        <div className="flex items-center sm:justify-end justify-start gap-2">
                          <p className="font-semibold text-text-primary">
                            Status:
                          </p>
                          <p className="font-semibold text-gray-500">
                            {order.isDelivered === false
                              ? "Pending"
                              : "Processed"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <></>
                )
              ) : (
                <div className="w-full flex justify-center">
                  <Spinner />
                </div>
              )}
              {/* {noUserOrderHistory?.length === 0 &&
              orderHistory?.length === 0 ? (
                <p className="text-center text-gray-500">
                  No order history available.
                </p>
              ) : (
                <></>
              )} */}
              {orderHistory && noUserOrderHistory ? (
                orderHistory.length === 0 && noUserOrderHistory.length === 0 ? (
                  <p className="text-center text-gray-500">
                    No order history available.
                  </p>
                ) : (
                  <></>
                )
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderHistory;
