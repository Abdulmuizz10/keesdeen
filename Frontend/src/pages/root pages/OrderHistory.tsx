import React, { useEffect, useState } from "react";
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
import { toast } from "sonner";
import Axios from "axios";
import { URL } from "../../lib/constants";
import { formatAmountDefault } from "../../lib/utils";

const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<any[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const [sortedOrders, setSortedOrders] = useState<any[]>([]);
  const [sortType, setSortType] = useState<string>("newest");

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchOrderHistory = async () => {
      try {
        const response = await Axios.get(`${URL}/orders/profile/orders`, {
          withCredentials: true,
        });
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        toast.error("Error fetching order");
        setLoading(false);
      }
    };
    fetchOrderHistory();
  }, []);

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
    <section className="px-[5%] py-24 md:py-30">
      <div className="container">
        <div className="rb-12 mb-12 md:mb-5">
          <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl bricolage-grotesque">
            Order History
          </h2>
          <p className="md:text-md">
            Preview and sort through your order history.
          </p>
        </div>

        {/* Filter Dropdown */}
        {loading ? (
          <div className="flex items-center justify-center w-full mt-5 border-t border-border-secondary">
            <div className="mt-20">
              <Spinner />
            </div>
          </div>
        ) : (
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
                      value="less-expensive"
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
                sortedOrders?.length > 0 ? (
                  sortedOrders.map((order: any, index: number) => (
                    <OrderCard order={order} key={index} />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center gap-4 mt-20">
                    <p className="text-base sm:text-md text-center text-text-secondary">
                      You haven’t placed any orders yet. Start shopping to place
                      your first one!
                    </p>

                    <Link to="/collections/shop_all">
                      <Button
                        className={`w-full my-4 sm:w-fit active:bg-brand-neutral/50 bg-brand-neutral text-text-light border-none rounded-md`}
                      >
                        Shop Now
                      </Button>
                    </Link>
                  </div>
                )
              ) : (
                <div className="w-full flex justify-center">
                  <Spinner />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

const OrderCard = ({ order }: { order: any }) => {
  return (
    <div className="bg-white border-b border-border-secondary py-5 sm:py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition duration-300">
      <div className="w-full sm:w-2/3 space-y-3">
        <div>
          <p className="text-base text-gray-500">Order ID:</p>
          <p className="text-lg font-semibold text-gray-900">{order._id}</p>
        </div>
        <div>
          <p className="text-base text-gray-500">Date ordered:</p>
          <p className="text-md font-medium text-gray-700">
            {new Date(order.paidAt).toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-base text-gray-500">Total:</p>
          <p className="text-md font-medium text-gray-700">
            {formatAmountDefault(order.currency, order.totalPrice)}
          </p>
        </div>
      </div>
      <div className="w-full md:w-1/3 flex flex-col items-start md:items-end gap-4">
        <div className="flex items-center max-sm:flex-col max-sm:items-start gap-2">
          <p className="text-gray-500 text-base">Status:</p>
          <p
            className={`font-semibold px-2 py-1 rounded ${
              order.status === "Delivered"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {order.status}
          </p>
        </div>
        <Link
          to={`/order_details/${order._id}`}
          className="w-full md:w-auto max-sm:mt-5"
        >
          <Button className="bg-brand-neutral text-white rounded-md py-2.5 px-5 text-base poppins w-full md:w-auto">
            More details
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default OrderHistory;
