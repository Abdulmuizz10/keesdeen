import Axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Spinner from "../../components/Spinner";
import { URL } from "../../lib/constants";
import { toast } from "react-toastify";
import { Country, State } from "country-state-city";
import { formatAmountDefault } from "../../lib/utils";
import { useShop } from "../../context/ShopContext";

const OrderDetails: React.FC = () => {
  const { id } = useParams();
  const { guestEmail: guest } = useShop();
  const [loading, setLoading] = useState<boolean>(true);
  const [order, setOrder] = useState<any>();

  const fetchData = async () => {
    try {
      const endpoint = guest
        ? `${URL}/orders/guest/order/${id}`
        : `${URL}/orders/profile/order/${id}`;
      const headers = !guest
        ? {
            withCredentials: true,
          }
        : {};

      const response = await Axios.get(endpoint, headers);
      const fetchedOrder = response.data;

      let countryCode = fetchedOrder.country;
      if (countryCode) {
        const country = Country.getCountryByCode(countryCode);
        fetchedOrder.country = country ? country.name : countryCode;
        countryCode = country ? country.isoCode : countryCode;
      }

      if (countryCode && fetchedOrder.cityAndRegion) {
        const state = State.getStateByCodeAndCountry(
          fetchedOrder.cityAndRegion,
          countryCode
        );
        fetchedOrder.cityAndRegion = state
          ? state.name
          : fetchedOrder.cityAndRegion;
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
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
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
    <section className="px-[5%] py-24 md:py-30">
      <div className="container mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 text-md">
          <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl bricolage-grotesque">
            Order Details
          </h2>
          <p className="mt-2 text-gray-500">Order ID: {_id}</p>
          <p
            className={`mt-2 font-medium ${
              isDelivered === "Delivered" ? "text-green-600" : "text-red-600"
            }`}
          >
            Status: {isDelivered}
          </p>
          <p className="mt-1 text-gray-500">
            Placed on: {new Date(createdAt).toLocaleString()}
          </p>
        </div>

        {/* Customer Information */}
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-800">
            Customer Information
          </h2>
          <div className="mt-4 space-y-2 text-md">
            <p className=" text-gray-600">
              <span className="font-medium">Name:</span> {firstName} {lastName}
            </p>
            <p className=" text-gray-600">
              <span className="font-medium">Email:</span> {email}
            </p>
            <p className=" text-gray-600">
              <span className="font-medium">Phone:</span> +
              {phoneNumber.slice(0, 3)} {phoneNumber.slice(3)}
            </p>
            <p className=" text-gray-600">
              <span className="font-medium">Address:</span> {addressLineOne},{" "}
              {addressLineTwo || ""}, {cityAndRegion}, {zipCode}, {country}
            </p>
          </div>
        </div>

        {/* Ordered Items */}
        <div className="p-6 bg-gray-50 rounded-md">
          <h2 className="text-lg font-semibold text-gray-800">Ordered Items</h2>
          <div className="mt-4 space-y-4">
            {orderedItems.map((item: any, index: number) => (
              <div key={index} className="flex items-center space-x-4 text-md">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded border"
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
            Payment Information
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
