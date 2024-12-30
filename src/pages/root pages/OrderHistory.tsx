import React, { useContext, useEffect, useState } from "react";
import Spinner from "../../components/Spinner";
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@relume_io/relume-ui";
import { Link } from "react-router-dom";
import Axios from "axios";
import { toast } from "react-toastify";
import { URL } from "../../lib/constants";
import { useShop } from "../../context/ShopContext";
import { AuthContext } from "../../context/AuthContext/AuthContext";

const OrderHistory: React.FC = () => {
  const { guestEmail, formatAmount } = useShop();
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState<any[]>();
  const [sortedOrders, setSortedOrders] = useState<any[]>([]);
  const [sortType, setSortType] = useState<string>("newest");

  useEffect(() => {
    const fetchOrderHistory = async () => {
      if (guestEmail) {
        try {
          const response = await Axios.get(
            `${URL}/orders/guest/orders?guest=${guestEmail}`,
            {
              validateStatus: (status) => status < 600,
            }
          );
          if (response.status === 200) {
            setOrders(response.data);
          } else {
            toast(response.data.message);
          }
        } catch (error) {
          toast.error("Error fetching order");
        }
      } else if (user) {
        try {
          const userToken = JSON.parse(
            localStorage.getItem("user") || "{}"
          ).token;
          const response = await Axios.get(`${URL}/orders/profile/orders`, {
            headers: {
              token: "Bearer " + userToken,
            },
          });
          setOrders(response.data);
        } catch (error) {
          toast.error("Error fetching order");
        }
      } else {
        toast("No previous orders!");
      }
    };
    fetchOrderHistory();
  }, [guestEmail]);

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
                sortedOrders.map((order: any, index: number) => (
                  <div
                    key={index}
                    className="bg-white shadow-md hover:shadow-lg rounded-lg py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition duration-300"
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
                          {new Date(order?.paidAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2 items-center">
                        <p className="text-sm text-gray-500">Items:</p>
                        {order.orderedItems.map((item: any, index: number) => (
                          <span
                            key={index}
                            className="bg-gray-100 text-gray-600 px-3 py-2 text-sm"
                          >
                            Name: {item.name} | Qty: X {item.qty} | Color:{" "}
                            {item?.color}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Right Section: Order Summary */}
                    <div className="w-full md:w-1/3 flex flex-col items-start md:items-end gap-6">
                      <div className="flex">
                        <p className="t text-gray-500">Total:</p>
                        <p className="px-1 font-semibold text-green-600">
                          {formatAmount(order.totalPrice)}
                        </p>
                      </div>
                      <div className="flex items-start sm:items-center gap-2">
                        <p className="text-gray-500">Status:</p>
                        <p
                          className={`font-semibold px-2 py-1 rounded mt-1 ${
                            order.isDelivered === "Delivered"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {order.isDelivered}
                        </p>
                      </div>
                      <Link to={`/order_details/${order._id}`}>
                        <Button className="bg-brand-neutral text-white rounded-md md:py-3 md:px-5 max-md:w-full text-base poppins">
                          More details
                        </Button>
                      </Link>
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
