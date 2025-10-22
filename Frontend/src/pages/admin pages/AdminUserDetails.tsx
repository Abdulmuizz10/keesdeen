import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@relume_io/relume-ui";
import Axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { URL } from "../../lib/constants";
import Spinner from "../../components/Spinner";
import { FaUserShield, FaTrashAlt, FaUser } from "react-icons/fa";
import { useShop } from "../../context/ShopContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { formatAmountDefault } from "../../lib/utils";

const AdminUserDetails: React.FC = () => {
  const { id } = useParams();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [sortedOrders, setSortedOrders] = useState<any[]>([]);
  const [sortType, setSortType] = useState<string>("newest");
  const { setAdminLoader } = useShop();
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await Axios.get(`${URL}/users/find/${id}`, {
        withCredentials: true,
      });
      setUser(response.data.user);
      setOrders(response.data.orders);
    } catch (error) {
      toast.error("Error getting user!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

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

  const handleUpdate = async (value: string) => {
    setLoading(true);
    if (value === null || value === undefined) {
      toast.error("Please select a status before updating");
      return;
    }
    try {
      const response = await Axios.put(
        `${URL}/users/update-to-admin/${id}`,
        { isAdmin: value },
        { withCredentials: true }
      );
      fetchData();
      toast.success(response.data.message || "User status updated");
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      // setLoading(false);
    }
  };

  const handleDelete = async (userId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (confirmDelete) {
      setAdminLoader(true);
      try {
        await Axios.delete(`${URL}/users/${userId}`, {
          withCredentials: true,
        });
        toast.success("User deleted successfully!");
        setAdminLoader(false);
        navigate("/admin/users");
      } catch (error) {
        setAdminLoader(false);
        toast.error("Error while deleting the user!");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white rounded-lg">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-lg p-8 border border-gray-200">
        <div className="flex items-center gap-4 mb-6 border-b pb-4">
          <div className="w-18 h-18 sm:w-24 sm:h-24 rounded-full border bg-brand-neutral flex items-center justify-center text-text-light text-3xl lg:text-4xl">
            {user?.firstName.split("")[0]}
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-gray-600 text-md">{user?.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between text-gray-800">
            <span className="font-medium poppins">Auth method:</span>
            <span className="text-gray-900">{user?.authMethod}</span>
          </div>
          <div className="flex justify-between text-gray-800">
            <span className="font-medium poppins">Signed up on:</span>
            <span className="text-gray-900">
              {new Date(user?.createdAt).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-gray-800">
            <span className="font-medium poppins">Admin status:</span>
            <span
              className={`px-3 py-1 text-sm font-semibold rounded-full ${
                user?.isAdmin
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-200 text-gray-700"
              } flex items-center gap-2`}
            >
              {user?.isAdmin ? (
                <>
                  <FaUserShield className="text-green-600" /> Admin
                </>
              ) : (
                <>
                  <FaUser /> Regular user
                </>
              )}
            </span>
          </div>

          <div className="flex justify-between text-gray-800">
            <span className="font-medium poppins">Update status:</span>
            <div className="w-full md:w-1/2">
              <Select onValueChange={handleUpdate}>
                <SelectTrigger className="rounded-md">
                  <SelectValue placeholder="Set Status" />
                </SelectTrigger>
                <SelectContent className="bg-background-light rounded-lg border border-border-secondary">
                  <SelectItem
                    value="true"
                    className="cursor-pointer hover:text-text-secondary"
                  >
                    Set to Admin
                  </SelectItem>
                  <SelectItem
                    value="false"
                    className="cursor-pointer hover:text-text-secondary"
                  >
                    Set to Regular user
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="mt-5 lg:mt-10 border-t">
          <div className="flex max-md:flex-col max-md:items-start items-center justify-between my-8">
            <h2 className="text-2xl font-bold mb-4">
              All Orders - ({orders?.length})
            </h2>
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
                  <div
                    key={index}
                    className="bg-white shadow-md rounded-lg py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition duration-300"
                  >
                    {/* Left Section: Order Details */}
                    <div className="w-full sm:w-2/3">
                      <div className="mb-6">
                        <p className="text-sm text-gray-500">Order ID</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {order._id}
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
                          {formatAmountDefault(
                            order.currency,
                            order.totalPrice
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
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
                      <Link
                        to={`/admin/order_details/${order._id}`}
                        className="max-md:w-full"
                      >
                        <Button className="bg-brand-neutral text-white rounded-md md:py-2.5 md:px-5 max-md:w-full text-base poppins">
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

        <div className="mt-6 flex justify-end gap-4">
          <button
            className="px-6 py-3 w-full sm:w-fit justify-center bg-brand-neutral text-white rounded-lg flex items-center gap-2 transition poppins"
            onClick={() => handleDelete(user?._id)}
          >
            <FaTrashAlt /> Delete User
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminUserDetails;
