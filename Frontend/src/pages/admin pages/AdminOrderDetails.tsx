import Axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Spinner from "../../components/Spinner";
import { URL } from "../../lib/constants";
import { toast } from "react-toastify";
import { Country, State } from "country-state-city";
import { formatAmountDefault } from "../../lib/utils";

const AdminOrderDetails: React.FC = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [order, setOrder] = useState<any>();

  const fetchData = async () => {
    try {
      const response = await Axios.get(`${URL}/orders/${id}`, {
        withCredentials: true,
      });
      const fetchedOrder = response.data;

      const updateCountryAndState = (address: any) => {
        if (!address) return;

        const countryCode = address.country;
        if (countryCode) {
          const country = Country.getCountryByCode(countryCode);
          address.country = country ? country.name : address.country;
          const updatedCountryCode = country ? country.isoCode : countryCode;

          const stateCode = address.state;
          if (updatedCountryCode && stateCode) {
            const state = State.getStateByCodeAndCountry(
              stateCode,
              updatedCountryCode
            );
            address.state = state ? state.name : address.state;
          }
        }
      };

      updateCountryAndState(fetchedOrder.shippingAddress);
      updateCountryAndState(fetchedOrder.billingAddress);

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
      const response = await Axios.patch(
        `${URL}/orders/${orderId}/deliver`,
        { status },
        {
          withCredentials: true,
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
    shippingAddress,
    billingAddress,
    email,
    guestOrder,
    guestEmail,
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
      <div className="p-6 border-b text-md">
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">
          Order Details - {_id}
        </h1>
        <p className="text-gray-600">
          <span className="font-medium">Placed on:</span>{" "}
          {new Date(createdAt).toLocaleString()}
        </p>
        <p
          className={`mt-2 ${
            isDelivered === "Delivered" ? "text-green-600" : "text-red-600"
          }`}
        >
          <span className="font-medium text-gray-600">Order status:</span>{" "}
          {isDelivered}
        </p>
        <select
          onChange={(e) => handleStatusChange(order._id, e.target.value)}
          className="border border-gray-300 py-2 px-3 mt-3 focus:ring-none rounded-md w-full sm:w-80 bg-white cursor-pointer"
        >
          <option value="">Select status</option>
          <option value={"Pending"}>Pending</option>
          <option value={"Processing"}>Processing</option>
          <option value={"Shipped"}>Shipped</option>
          <option value={"Delivered"}>Delivered</option>
        </select>
      </div>

      {/* Customer Information */}
      <div className="p-6 border-b text-md space-y-2">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          Delivery information
        </h2>
        <p className="text-gray-800">
          <span className="font-medium">Name:</span> {shippingAddress.firstName}{" "}
          {shippingAddress.lastName}
        </p>
        <p className="text-gray-800">
          <span className="font-medium">Email:</span> {email}
        </p>
        <p className="text-gray-800">
          <span className="font-medium">Phone:</span> +
          {shippingAddress.phoneNumber.slice(0, 3)}{" "}
          {shippingAddress.phoneNumber.slice(3)}
        </p>
        <p className="text-gray-800">
          <span className="font-medium">Address:</span>{" "}
          {shippingAddress.addressLineOne},{" "}
          {shippingAddress.addressLineTwo || ""}, {shippingAddress.zipCode},{" "}
          {shippingAddress.state}, {shippingAddress.country}.
        </p>
        {guestOrder && (
          <>
            <p className="text-gray-800">
              <span className="font-medium">Guest order:</span>{" "}
              {guestOrder && "Yes"}
            </p>
            <p className="text-gray-800">
              <span className="font-medium">Guest Email:</span> {guestEmail}
            </p>
          </>
        )}
      </div>

      {/* Order Items */}
      <div className="p-6 border-b">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          Ordered products
        </h2>
        <div className="space-y-5 text-md">
          {orderedItems.map((item: any, index: number) => (
            <div key={index} className="flex items-center space-x-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-32 h-36 object-cover rounded-md border"
              />
              <div>
                <p className="font-medium text-gray-800">{item.name}</p>
                <p className="text-gray-800">
                  Quantity: {item.qty} | Price: {currency} {item.price} | Color:{" "}
                  {item?.color}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Information */}
      <div className="p-6 text-md space-y-2">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          Payment information
        </h2>
        <p className="text-gray-800">
          <span className="font-medium">Total Price:</span>{" "}
          {formatAmountDefault(currency, totalPrice)}
        </p>
        <p className="text-gray-800">
          <span className="font-medium">Shipping:</span>{" "}
          {formatAmountDefault(currency, shippingPrice)}
        </p>
        <p className="text-gray-800">
          <span className="font-medium">Paid At:</span>{" "}
          {new Date(paidAt).toLocaleString()}
        </p>
        <p className="text-gray-800">
          <span className="font-medium">Delivered At:</span>{" "}
          {deliveredAt
            ? new Date(deliveredAt).toLocaleString()
            : "Not Delivered"}
        </p>
      </div>

      {/* Billing Address */}
      {billingAddress && (
        <div className="p-6 text-md space-y-2 border-t">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">
            Billing information
          </h2>
          <p className="text-gray-800">
            <span className="font-medium">Name:</span>{" "}
            {billingAddress.firstName} {billingAddress.lastName}
          </p>
          <p className="text-gray-800">
            <span className="font-medium">Phone:</span> +
            {billingAddress.phoneNumber.slice(0, 3)}{" "}
            {billingAddress.phoneNumber.slice(3)}
          </p>
          <p className="text-gray-800">
            <span className="font-medium">Address:</span>{" "}
            {billingAddress.zipCode}, {billingAddress.state},{" "}
            {billingAddress.street}, {billingAddress.country}.
          </p>
        </div>
      )}
    </section>
  );
};

export default AdminOrderDetails;
