import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Country, State } from "country-state-city";
import { CheckCircle } from "lucide-react";
import { formatAmountDefault } from "../../lib/utils";

const OrderConfirmation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state?.orderData;

  // Redirect if no order data
  React.useEffect(() => {
    if (!orderData) {
      navigate("/");
    }
  }, [orderData, navigate]);

  if (!orderData) {
    return null;
  }

  const country = Country.getAllCountries().find(
    (c) => c.isoCode === orderData.shippingAddress.country
  )?.name;

  const state = State.getStatesOfCountry(
    orderData.shippingAddress.country
  ).find((s) => s.isoCode === orderData.shippingAddress.state)?.name;

  const totalItems = orderData.orderedItems.reduce(
    (sum: number, item: any) => sum + item.qty,
    0
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <section className="placing">
      {/* Success Icon & Message */}
      <div className="mb-10 lg:mb-16 text-center">
        <div className="mb-6 flex justify-center">
          <CheckCircle size={64} strokeWidth={1.5} className="text-green-600" />
        </div>
        <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
          <span>Order Confirmed</span>
        </h2>
        <p className="text-sm text-text-secondary">
          Thank you for your purchase! Your order has been placed successfully.
        </p>
      </div>

      {/* Order Summary */}
      <div className="mb-12 border-b border-gray-200 pb-8">
        <h2 className="mb-6 text-sm uppercase tracking-wider">Order Details</h2>
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Order ID</span>
            <span className="font-light">
              {orderData._id.slice(-8).toUpperCase()}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Date</span>
            <span className="font-light">{formatDate(orderData.paidAt)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Email</span>
            <span className="font-light">{orderData.email}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Items</span>
            <span className="font-light">{totalItems}</span>
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="mb-12 border-b border-gray-200 pb-8">
        <h2 className="mb-6 text-sm uppercase tracking-wider">
          Shipping Address
        </h2>
        <div className="space-y-1 text-sm leading-relaxed text-gray-600">
          <p className="font-light text-gray-900">
            {orderData.shippingAddress.firstName}{" "}
            {orderData.shippingAddress.lastName}
          </p>
          <p>{orderData.shippingAddress.address1}</p>
          {orderData.shippingAddress.address2 && (
            <p>{orderData.shippingAddress.address2}</p>
          )}
          <p>
            {state || orderData.shippingAddress.state},{" "}
            {country || orderData.shippingAddress.country}
          </p>
          <p>{orderData.shippingAddress.postalCode}</p>
          <p className="pt-2">+{orderData.shippingAddress.phone}</p>
        </div>
      </div>

      {/* Order Items */}
      <div className="mb-12 border-b border-gray-200 pb-8">
        <h2 className="mb-6 text-sm uppercase tracking-wider">Items Ordered</h2>
        <div className="space-y-6">
          {orderData.orderedItems.map((item: any, index: number) => (
            <div
              key={index}
              className="flex gap-6 border-b border-gray-100 pb-6 last:border-0"
            >
              {/* Image */}
              {item.image && (
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden bg-gray-50">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              {/* Details */}
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <h3 className="mb-1 font-light tracking-tight">
                    {item.name}
                  </h3>
                  {item.size && item.color && (
                    <p className="text-sm text-gray-500">
                      {item.size} / {item.color}
                    </p>
                  )}
                  <p className="mt-1 text-sm text-gray-500">Qty: {item.qty}</p>
                </div>
              </div>

              {/* Price */}
              <div className="text-right">
                <p className="text-sm font-light">
                  {formatAmountDefault(orderData.currency, item.price)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Total */}
      <div className="mb-12 border-b border-gray-200 pb-8">
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-light">
              {formatAmountDefault(
                orderData.currency,
                orderData.totalPrice - orderData.shippingPrice
              )}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Shipping</span>
            <span className="font-light">
              {orderData.shippingPrice === 0
                ? "Free"
                : formatAmountDefault(
                    orderData.currency,
                    orderData.shippingPrice
                  )}
            </span>
          </div>
          {orderData.coupon && (
            <div className="flex justify-between text-green-600">
              <span>Discount ({orderData.coupon})</span>
              <span className="font-light">Applied</span>
            </div>
          )}
          <div className="flex justify-between border-t border-gray-200 pt-3 font-light">
            <span>Total</span>
            <span className="text-base">
              {formatAmountDefault(orderData.currency, orderData.totalPrice)}
            </span>
          </div>
        </div>
      </div>

      {/* Receipt Link */}
      {orderData.paymentResult?.payment?.receiptUrl && (
        <div className="mb-8 text-center">
          <a
            href={orderData.paymentResult.payment.receiptUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border-b border-gray-900 pb-1 text-sm uppercase tracking-widest text-gray-900 transition-colors hover:border-gray-400 hover:text-gray-400"
          >
            View Receipt
          </a>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <Link to="/profile" className="flex-1">
          <button className="w-full border border-gray-300 bg-white py-4 text-sm uppercase tracking-widest text-gray-900 transition-colors hover:bg-gray-50">
            View Orders
          </button>
        </Link>
        <Link to="/collections/shop_all" className="flex-1">
          <button className="w-full border border-gray-900 bg-gray-900 py-4 text-sm uppercase tracking-widest text-white transition-colors hover:bg-gray-800">
            Continue Shopping
          </button>
        </Link>
      </div>
    </section>
  );
};

export default OrderConfirmation;
