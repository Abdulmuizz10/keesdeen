import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Spinner from "../../components/Spinner";
import { toast } from "sonner";
import Axios from "axios";
import { URL } from "../../lib/constants";
import { Country, State } from "country-state-city";
import { formatAmountDefault } from "../../lib/utils";

const OrderDetails: React.FC = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [order, setOrder] = useState<any>();

  const fetchData = async () => {
    try {
      const endpoint = `${URL}/orders/profile/orders/${id}`;
      const headers = {
        withCredentials: true,
      };

      const response = await Axios.get(endpoint, headers);
      const fetchedOrder = response.data;

      let countryCode = fetchedOrder.shippingAddress.country;
      if (countryCode) {
        const country = Country.getCountryByCode(countryCode);
        fetchedOrder.shippingAddress.country = country
          ? country.name
          : countryCode;
        countryCode = country ? country.isoCode : countryCode;
      }

      if (countryCode && fetchedOrder.shippingAddress.state) {
        const state = State.getStateByCodeAndCountry(
          fetchedOrder.shippingAddress.state,
          countryCode
        );
        fetchedOrder.shippingAddress.state = state
          ? state.name
          : fetchedOrder.shippingAddress.state;
      }

      setOrder(fetchedOrder);
    } catch (error) {
      toast.error("Error fetching order details!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <Spinner />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-lg font-semibold text-gray-600">Order not found.</p>
      </div>
    );
  }

  const {
    _id,
    shippingAddress,
    email,
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
    <section className="px-[5%] py-24 md:py-30">
      <div className="mx-auto bg-white rounded-lg overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 text-md space-y-2">
          <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl bricolage-grotesque">
            Order Details
          </h2>
          <p className="text-gray-600">
            <span className="font-medium">Order ID:</span> {_id}
          </p>
          <p
            className={`mt-2 ${
              isDelivered === "Delivered" ? "text-green-600" : "text-red-600"
            }`}
          >
            <span className="font-medium text-gray-600">Order status:</span>{" "}
            {isDelivered}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Placed on:</span>{" "}
            {new Date(createdAt).toLocaleString()}
          </p>
        </div>

        {/* Customer Information */}
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-800">
            Shipping information
          </h2>
          <div className="mt-4 space-y-2 text-md">
            <p className=" text-gray-600">
              <span className="font-medium">Name:</span>{" "}
              {shippingAddress.firstName} {shippingAddress.lastName}
            </p>
            <p className=" text-gray-600">
              <span className="font-medium">Email:</span> {email}
            </p>
            <p className=" text-gray-600">
              <span className="font-medium">Phone:</span> +
              {shippingAddress.phoneNumber.slice(0, 3)}{" "}
              {shippingAddress.phoneNumber.slice(3)}
            </p>
            <p className=" text-gray-600">
              <span className="font-medium">Address:</span>{" "}
              {shippingAddress.addressLineOne},{" "}
              {shippingAddress.addressLineTwo || ""}, {shippingAddress.state},{" "}
              {shippingAddress.zipCode}, {shippingAddress.country}
            </p>
          </div>
        </div>

        {/* Ordered Items */}
        <div className="p-6 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-800">
            Ordered products
          </h2>
          <div className="mt-4 space-y-4">
            {orderedItems.map((item: any, index: number) => (
              <div key={index} className="flex items-center space-x-4 text-md">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-28 h-30 object-cover rounded border"
                />
                <div>
                  <p className="font-medium text-gray-800">{item.name}</p>
                  <p className="text-gray-600">
                    Quantity: {item.qty} | Price: {currency} {item.price} |{" "}
                    Color: {item?.color}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Information */}
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-800">
            Payment information
          </h2>
          <div className="mt-4 space-y-2 text-md">
            <p className="text-gray-600">
              <span className="font-medium">Total Price:</span>{" "}
              {formatAmountDefault(currency, totalPrice)}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Shipping:</span>{" "}
              {formatAmountDefault(currency, shippingPrice)}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Paid At:</span>{" "}
              {new Date(paidAt).toLocaleString()}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Delivered At:</span>{" "}
              {deliveredAt
                ? new Date(deliveredAt).toLocaleString()
                : "Not Delivered"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderDetails;
