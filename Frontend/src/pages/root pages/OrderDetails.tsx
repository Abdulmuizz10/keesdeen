import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Country, State } from "country-state-city";
import { toast } from "sonner";
import Axios from "axios";
import { URL } from "../../lib/constants";
import { formatAmountDefault } from "../../lib/utils";

const OrderDetails: React.FC = () => {
  const [order, setOrder] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);
  const { id } = useParams();

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const response = await Axios.get(`${URL}/orders/profile/order/${id}`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setOrder(response.data);
        console.log(response.data);
      }
    } catch (error) {
      toast.error("Error getting order. Please refresh the page");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "text-green-600";
      case "Pending":
        return "text-amber-600";
      case "Cancelled":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  if (loading) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-12 md:px-6 lg:px-8">
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-sm uppercase tracking-widest text-gray-400">
            Loading...
          </div>
        </div>
      </section>
    );
  }

  if (!order) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-12 md:px-6 lg:px-8">
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-sm uppercase tracking-widest text-gray-400">
            Order not found
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="placing">
      {/* Header */}
      <h2 className="text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
        <span>Order details</span>
      </h2>
      <div className="mb-10 border-b border-gray-200 pb-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
          <div>
            <h1 className="mb-2 text-2xl font-light tracking-tight md:text-3xl md:hidden">
              Order - {order._id.slice(-8).toUpperCase()}
            </h1>
            <h1 className="mb-2 text-2xl font-light tracking-tight md:text-3xl hidden md:block">
              Order - {order._id.toUpperCase()}
            </h1>
            <p className="text-sm text-gray-500">
              Placed {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="text-left md:text-right">
            <div
              className={`mb-1 inline-block text-xs font-medium uppercase tracking-wider ${getStatusColor(
                order.isDelivered
              )}`}
            >
              {order.isDelivered}
            </div>
            <p className="text-sm text-gray-500">
              Paid {formatDate(order.paidAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="mb-16">
        <h2 className="mb-8 text-xs font-medium uppercase tracking-widest text-gray-500">
          Items
        </h2>
        <div className="space-y-8">
          {order.orderedItems.map((item: any, index: number) => (
            <div
              key={index}
              className="flex gap-6 border-b border-gray-100 pb-8 last:border-0"
            >
              {item.image && (
                <div className="h-32 w-32 flex-shrink-0 overflow-hidden bg-gray-50">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <h3 className="mb-1 font-light tracking-tight">
                    {item.name}
                  </h3>

                  <p className="text-sm text-gray-500">Color: {item.color}</p>

                  <p className="mt-2 text-sm text-gray-500">Qty: {item.qty}</p>
                </div>
                <p className="mt-4 text-sm font-light">
                  {formatAmountDefault(order.currency, item.price)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Addresses & Summary Grid */}
      <div className="grid gap-12 lg:grid-cols-3">
        {/* Addresses */}
        <div className="lg:col-span-2">
          <h2 className="mb-8 text-xs font-medium uppercase tracking-widest text-gray-500">
            Delivery Information
          </h2>
          <div className="grid gap-12 md:grid-cols-2">
            {/* Shipping Address */}
            <div>
              <h3 className="mb-4 text-sm font-medium uppercase tracking-wider">
                Shipping Address
              </h3>
              <div className="space-y-1 text-sm leading-relaxed text-gray-600">
                <p className="text-gray-900">
                  {order.shippingAddress.firstName}{" "}
                  {order.shippingAddress.lastName}
                </p>
                <p>{order.shippingAddress.address1}</p>
                {order.shippingAddress.address2 && (
                  <p>{order.shippingAddress.address2}</p>
                )}
                <p>
                  {State.getStateByCodeAndCountry(
                    order.shippingAddress.state,
                    order.shippingAddress.country
                  )?.name || order.shippingAddress.state}
                  ,{" "}
                  {Country.getCountryByCode(order.shippingAddress.country)
                    ?.name || order.shippingAddress.country}
                </p>
                <p>{order.shippingAddress.postalCode}</p>
                <p className="pt-3">+{order.shippingAddress.phone}</p>
              </div>
            </div>

            {/* Billing Address */}
            <div>
              <h3 className="mb-4 text-sm font-medium uppercase tracking-wider">
                Billing Address
              </h3>
              <div className="space-y-1 text-sm leading-relaxed text-gray-600">
                <p className="text-gray-900">
                  {order.billingAddress.firstName}{" "}
                  {order.billingAddress.lastName}
                </p>
                <p>{order.billingAddress.address1}</p>
                {order.billingAddress.address2 && (
                  <p>{order.billingAddress.address2}</p>
                )}
                <p>
                  {State.getStateByCodeAndCountry(
                    order.billingAddress.state,
                    order.billingAddress.country
                  )?.name || order.billingAddress.state}
                  ,{" "}
                  {Country.getCountryByCode(order.billingAddress.country)
                    ?.name || order.billingAddress.country}
                </p>
                <p>{order.billingAddress.postalCode}</p>
                <p className="pt-3">+{order.billingAddress.phone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <h2 className="mb-8 text-xs font-medium uppercase tracking-widest text-gray-500">
            Summary
          </h2>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-light">
                {formatAmountDefault(
                  order.currency,
                  order.totalPrice - order.shippingPrice
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery</span>
              <span className="font-light">
                {order.shippingPrice === 0
                  ? "Free"
                  : `${order.currency} ${order.shippingPrice.toFixed(2)}`}
              </span>
            </div>
            {order.coupon && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span className="font-light">{order.coupon}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-gray-200 pt-4 font-light">
              <span>Total</span>
              <span className="text-base">
                {formatAmountDefault(order.currency, order.totalPrice)}
              </span>
            </div>
          </div>

          {/* Contact */}
          <div className="mt-12 border-t border-gray-200 pt-8">
            <h3 className="mb-4 text-xs font-medium uppercase tracking-widest text-gray-500">
              Contact
            </h3>
            <p className="text-sm text-gray-600">{order.email}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderDetails;
