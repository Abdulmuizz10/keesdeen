import React, { useEffect, useState } from "react";
import Spinner from "../../components/Spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@relume_io/relume-ui";
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
  const [sortedOrders, setSortedOrders] = useState<any[]>([]); // State for sorted orders
  const [sortType, setSortType] = useState<string>("newest"); // Default sort type

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

  // Sort orders whenever the `sortType` or `orders` change
  useEffect(() => {
    if (orders) {
      let sorted = [...orders];
      switch (sortType) {
        case "latest":
          sorted = sorted.sort(
            (a, b) =>
              new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime()
          );
          break;
        case "oldest":
          sorted = sorted.sort(
            (a, b) =>
              new Date(a.paidAt).getTime() - new Date(b.paidAt).getTime()
          );
          break;
        case "most-expensive":
          sorted = sorted.sort((a, b) => b.totalPrice - a.totalPrice);
          break;
        case "less-expensive":
          sorted = sorted.sort((a, b) => a.totalPrice - b.totalPrice);
          break;
        default:
          break;
      }
      setSortedOrders(sorted);
    }
  }, [orders, sortType]);

  return (
    <section id="relume" className="px-[5%] py-24 md:py-30">
      <div className="container">
        <div className="rb-12 mb-12 md:mb-5">
          <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl bricolage-grotesque">
            Order History
          </h2>
          <p className="md:text-md">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        </div>

        {/* Filter Dropdown */}
        <div className="mt-5 border-t border-border-secondary">
          <div className="flex max-md:flex-col max-md:items-start items-center justify-between my-8">
            <h2 className="text-2xl font-bold mb-4">All Orders</h2>
            <div className="w-full md:w-1/2">
              <Select onValueChange={setSortType}>
                <SelectTrigger className="rounded-md">
                  <SelectValue placeholder="Sort Orders" />
                </SelectTrigger>
                <SelectContent className=" bg-background-light rounded-lg border border-border-secondary">
                  <SelectItem
                    value="latest"
                    className=" cursor-pointer hover:text-text-secondary
                      "
                  >
                    Latest
                  </SelectItem>
                  <SelectItem
                    value="oldest"
                    className=" cursor-pointer  hover:text-text-secondary"
                  >
                    Oldest
                  </SelectItem>
                  <SelectItem
                    value="most-expensive"
                    className=" cursor-pointer  hover:text-text-secondary"
                  >
                    Most Expensive
                  </SelectItem>
                  <SelectItem
                    value="less_expensive"
                    className=" cursor-pointer  hover:text-text-secondary"
                  >
                    Less Expensive
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-6 mt-8">
            {sortedOrders ? (
              sortedOrders.length > 0 ? (
                sortedOrders.map((order: any) => (
                  <div
                    key={order.id}
                    className="bg-white shadow-md hover:shadow-lg rounded-lg py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 transition duration-300"
                  >
                    {/* Left Section: Order Details */}
                    <div className="w-full sm:w-2/3">
                      <div className="mb-6">
                        <p className="text-sm text-gray-500">Order ID</p>
                        <p className="text-lg font-semibold text-gray-900">
                          #{order._id}
                        </p>
                      </div>
                      <div className="mb-6">
                        <p className="text-sm text-gray-500">Order Date</p>
                        <p className="text-md font-medium text-gray-700">
                          {order?.paidAt?.slice(0, 10)} at{" "}
                          {order?.paidAt?.slice(11, 19)}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2 items-center">
                        <p className="text-sm text-gray-500">Items:</p>
                        {order.orderedItems.map((item: any, index: number) => (
                          <span
                            key={index}
                            className="bg-gray-100 text-gray-600 px-3 py-2 text-sm"
                          >
                            {item.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Right Section: Order Summary */}
                    <div className="w-full sm:w-1/3 flex flex-col items-start sm:items-end gap-6">
                      <div className="">
                        <p className="text-sm text-gray-500">Total</p>
                        <p className="text-xl px-1 font-semibold text-green-600">
                          {formatAmount(order.totalPrice)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <p
                          className={`text-sm font-semibold px-2 py-2 rounded mt-1 ${
                            order.isDelivered
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
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
    </section>
  );
};

export default OrderHistory;
