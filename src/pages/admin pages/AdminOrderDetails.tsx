import Axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Spinner from "../../components/Spinner";
import { URL } from "../../lib/constants";
import { toast } from "react-toastify";
import { Country } from "country-state-city";

const AdminOrderDetails: React.FC = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [order, setOrder] = useState<any>();

  const fetchData = async () => {
    try {
      const userToken = JSON.parse(localStorage.getItem("user") || "{}").token;
      const response = await Axios.get(`${URL}/orders/${id}`, {
        headers: {
          token: "Bearer " + userToken,
        },
      });
      const fetchedOrder = response.data;

      if (fetchedOrder.country) {
        const country = Country.getCountryByCode(fetchedOrder.country);
        fetchedOrder.country = country ? country.name : fetchedOrder.country;
      }

      setOrder(fetchedOrder);
    } catch (error) {
      toast.error("Error fetching order:");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleStatusChange = async (orderId: any, status: string) => {
    setLoading(true);
    try {
      const userToken = JSON.parse(localStorage.getItem("user") || "{}").token;
      const response = await Axios.patch(
        `${URL}/orders/${orderId}/deliver`,
        { status },
        {
          headers: {
            token: "Bearer " + userToken,
          },
          validateStatus: (status: any) => status < 600,
        }
      );
      if (response.status === 200) {
        setLoading(false);
        fetchData();
        toast.success(response.data.message);
      } else {
        setLoading(false);
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (error) {
      setLoading(false);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white rounded-lg">
        <Spinner />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center h-screen bg-white rounded-lg">
        <p className="text-gray-600">Order not found.</p>
      </div>
    );
  }

  const {
    _id,
    firstName,
    lastName,
    email,
    phoneNumber,
    addressLineOne,
    addressLineTwo,
    cityAndRegion,
    country,
    zipCode,
    orderedItems,
    totalPrice,
    shippingPrice,
    currency,
    paidAt,
    isDelivered,
    deliveredAt,
    createdAt,
  } = order;

  return (
    <section className="bg-white rounded-lg">
      {/* Order Overview */}
      <div className="p-6 border-b">
        <h1 className="text-3xl font-semibold text-gray-800">
          Order Details - {_id}
        </h1>
        <p className="text-lg text-gray-600">
          <span className="font-medium">Placed on:</span>{" "}
          {new Date(createdAt).toLocaleString()}
        </p>
        <p
          className={`mt-2 text-base ${
            isDelivered === "Delivered" ? "text-green-600" : "text-red-600"
          }`}
        >
          Status: {isDelivered}
        </p>
        <select
          onChange={(e) => handleStatusChange(order._id, e.target.value)}
          className="border border-gray-300  py-3 px-3 mt-3 focus:ring-none rounded-md poppins w-full sm:w-80 bg-white"
        >
          <option value="">Select status</option>
          <option value={"Pending"}>Pending</option>
          <option value={"Processing"}>Processing</option>
          <option value={"Shipped"}>Shipped</option>
          <option value={"Delivered"}>Delivered</option>
        </select>
      </div>

      {/* Customer Information */}
      <div className="p-6 border-b">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          Customer Information
        </h2>
        <p className="text-lg text-gray-800">
          <span className="font-medium">Name:</span> {firstName} {lastName}
        </p>
        <p className="text-lg text-gray-800">
          <span className="font-medium">Email:</span> {email}
        </p>
        <p className="text-lg text-gray-800">
          <span className="font-medium">Phone:</span> {phoneNumber}
        </p>
        <p className="text-lg text-gray-800">
          <span className="font-medium">Address:</span> {addressLineOne},{" "}
          {addressLineTwo || ""} {cityAndRegion}, {zipCode}, {country}
        </p>
      </div>

      {/* Order Items */}
      <div className="p-6 border-b">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          Ordered Items
        </h2>
        <div className="space-y-4">
          {orderedItems.map((item: any, index: number) => (
            <div key={index} className="flex items-center space-x-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-28 h-28 rounded-md border"
              />
              <div>
                <p className="text-xl font-medium text-gray-800">{item.name}</p>
                <p className="text-lg text-gray-800">
                  Quantity: {item.qty} | Price: {currency} {item.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Information */}
      <div className="p-6">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          Payment Information
        </h2>
        <p className="text-lg text-gray-800">
          <span className="font-medium">Total Price:</span> {currency}{" "}
          {totalPrice}
        </p>
        <p className="text-lg text-gray-800">
          <span className="font-medium">Shipping:</span> {currency}{" "}
          {shippingPrice}
        </p>
        <p className="text-lg text-gray-800">
          <span className="font-medium">Paid At:</span>{" "}
          {new Date(paidAt).toLocaleString()}
        </p>
        <p className="text-lg text-gray-800">
          <span className="font-medium">Delivered At:</span>{" "}
          {deliveredAt
            ? new Date(deliveredAt).toLocaleString()
            : "Not Delivered"}
        </p>
      </div>
    </section>
  );
};

export default AdminOrderDetails;
