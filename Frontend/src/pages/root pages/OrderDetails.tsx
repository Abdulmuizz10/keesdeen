// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { Country, State } from "country-state-city";
// import { toast } from "sonner";
// import { formatAmountDefault } from "../../lib/utils";
// import axiosInstance from "@/lib/axiosConfig";

// const OrderDetails: React.FC = () => {
//   const [order, setOrder] = useState<any>();
//   const [loading, setLoading] = useState<boolean>(true);
//   const { id } = useParams();

//   const fetchOrder = async () => {
//     setLoading(true);
//     try {
//       const response = await axiosInstance.get(`/orders/profile/order/${id}`);
//       if (response.status === 200) {
//         setOrder(response.data);
//         console.log(response.data);
//       }
//     } catch (error) {
//       toast.error("Error getting order. Please refresh the page");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrder();
//   }, [id]);

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "Delivered":
//         return "text-green-600";
//       case "Pending":
//         return "text-amber-600";
//       case "Cancelled":
//         return "text-red-600";
//       default:
//         return "text-gray-600";
//     }
//   };

//   if (loading) {
//     return (
//       <section className="mx-auto max-w-6xl px-4 py-12 md:px-6 lg:px-8">
//         <div className="flex min-h-[60vh] items-center justify-center">
//           <div className="text-sm uppercase tracking-widest text-gray-400">
//             Loading...
//           </div>
//         </div>
//       </section>
//     );
//   }

//   if (!order) {
//     return (
//       <section className="mx-auto max-w-6xl px-4 py-12 md:px-6 lg:px-8">
//         <div className="flex min-h-[60vh] items-center justify-center">
//           <p className="text-sm uppercase tracking-widest text-gray-400">
//             Order not found
//           </p>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className="placing">
//       {/* Header */}
//       <h2 className="text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
//         <span>Order details</span>
//       </h2>
//       <div className="mb-10 border-b border-gray-200 pb-8">
//         <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
//           <div>
//             <h1 className="mb-2 text-2xl font-light tracking-tight md:text-3xl md:hidden">
//               Order - {order._id.slice(-8).toUpperCase()}
//             </h1>
//             <h1 className="mb-2 text-2xl font-light tracking-tight md:text-3xl hidden md:block">
//               Order - {order._id.toUpperCase()}
//             </h1>
//             <p className="text-sm text-gray-500">
//               Placed {formatDate(order.createdAt)}
//             </p>
//           </div>
//           <div className="text-left md:text-right">
//             <div
//               className={`mb-1 inline-block text-xs font-medium uppercase tracking-wider ${getStatusColor(
//                 order.status
//               )}`}
//             >
//               {order.status}
//             </div>
//             <p className="text-sm text-gray-500">
//               Paid {formatDate(order.paidAt)}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Items */}
//       <div className="mb-16">
//         <h2 className="mb-8 text-xs font-medium uppercase tracking-widest text-gray-500">
//           Items
//         </h2>
//         <div className="space-y-8">
//           {order.orderedItems.map((item: any, index: number) => (
//             <div
//               key={index}
//               className="flex gap-6 border-b border-gray-100 pb-8 last:border-0"
//             >
//               {item.image && (
//                 <div className="h-32 w-32 flex-shrink-0 overflow-hidden bg-gray-50">
//                   <img
//                     src={item.image}
//                     alt={item.name}
//                     className="h-full w-full object-cover"
//                   />
//                 </div>
//               )}
//               <div className="flex flex-1 flex-col justify-between">
//                 <div>
//                   <h3 className="mb-1 font-light tracking-tight">
//                     {item.name}
//                   </h3>

//                   <p className="text-sm text-gray-500">Color: {item.color}</p>

//                   <p className="mt-2 text-sm text-gray-500">Qty: {item.qty}</p>
//                 </div>
//                 <p className="mt-4 text-sm font-light">
//                   {formatAmountDefault(order.currency, item.price)}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Addresses & Summary Grid */}
//       <div className="grid gap-12 lg:grid-cols-3">
//         {/* Addresses */}
//         <div className="lg:col-span-2">
//           <h2 className="mb-8 text-xs font-medium uppercase tracking-widest text-gray-500">
//             Delivery Information
//           </h2>
//           <div className="grid gap-12 md:grid-cols-2">
//             {/* Shipping Address */}
//             <div>
//               <h3 className="mb-4 text-sm font-medium uppercase tracking-wider">
//                 Shipping Address
//               </h3>
//               <div className="space-y-1 text-sm leading-relaxed text-gray-600">
//                 <p className="text-gray-900">
//                   {order.shippingAddress.firstName}{" "}
//                   {order.shippingAddress.lastName}
//                 </p>
//                 <p>{order.shippingAddress.address1}</p>
//                 {order.shippingAddress.address2 && (
//                   <p>{order.shippingAddress.address2}</p>
//                 )}
//                 <p>
//                   {State.getStateByCodeAndCountry(
//                     order.shippingAddress.state,
//                     order.shippingAddress.country
//                   )?.name || order.shippingAddress.state}
//                   ,{" "}
//                   {Country.getCountryByCode(order.shippingAddress.country)
//                     ?.name || order.shippingAddress.country}
//                 </p>
//                 <p>{order.shippingAddress.postalCode}</p>
//                 <p className="pt-3">+{order.shippingAddress.phone}</p>
//               </div>
//             </div>

//             {/* Billing Address */}
//             <div>
//               <h3 className="mb-4 text-sm font-medium uppercase tracking-wider">
//                 Billing Address
//               </h3>
//               <div className="space-y-1 text-sm leading-relaxed text-gray-600">
//                 <p className="text-gray-900">
//                   {order.billingAddress.firstName}{" "}
//                   {order.billingAddress.lastName}
//                 </p>
//                 <p>{order.billingAddress.address1}</p>
//                 {order.billingAddress.address2 && (
//                   <p>{order.billingAddress.address2}</p>
//                 )}
//                 <p>
//                   {State.getStateByCodeAndCountry(
//                     order.billingAddress.state,
//                     order.billingAddress.country
//                   )?.name || order.billingAddress.state}
//                   ,{" "}
//                   {Country.getCountryByCode(order.billingAddress.country)
//                     ?.name || order.billingAddress.country}
//                 </p>
//                 <p>{order.billingAddress.postalCode}</p>
//                 <p className="pt-3">+{order.billingAddress.phone}</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Order Summary */}
//         <div className="lg:col-span-1">
//           <h2 className="mb-8 text-xs font-medium uppercase tracking-widest text-gray-500">
//             Summary
//           </h2>
//           <div className="space-y-4 text-sm">
//             <div className="flex justify-between">
//               <span className="text-gray-600">Subtotal</span>
//               <span className="font-light">
//                 {formatAmountDefault(
//                   order.currency,
//                   order.totalPrice - order.shippingPrice
//                 )}
//               </span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-600">Delivery</span>
//               <span className="font-light">
//                 {order.shippingPrice === 0
//                   ? "Free"
//                   : `${order.currency} ${order.shippingPrice.toFixed(2)}`}
//               </span>
//             </div>
//             {order.coupon && (
//               <div className="flex justify-between text-green-600">
//                 <span>Discount</span>
//                 <span className="font-light">{order.coupon}</span>
//               </div>
//             )}
//             <div className="flex justify-between border-t border-gray-200 pt-4 font-light">
//               <span>Total</span>
//               <span className="text-base">
//                 {formatAmountDefault(order.currency, order.totalPrice)}
//               </span>
//             </div>
//           </div>

//           {/* Contact */}
//           <div className="mt-12 border-t border-gray-200 pt-8">
//             <h3 className="mb-4 text-xs font-medium uppercase tracking-widest text-gray-500">
//               Contact
//             </h3>
//             <p className="text-sm text-gray-600">{order.email}</p>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default OrderDetails;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Country, State } from "country-state-city";
import { X } from "lucide-react";
import { toast } from "sonner";
import { formatAmountDefault } from "../../lib/utils";
import axiosInstance from "@/lib/axiosConfig";

const OrderDetails: React.FC = () => {
  const [order, setOrder] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false);
  const [cancellationReason, setCancellationReason] = useState<string>("");
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [isCancelling, setIsCancelling] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const { id } = useParams();

  // Cancellation reason options
  const cancellationReasons = [
    { value: "changed_mind", label: "Changed my mind" },
    { value: "found_better_price", label: "Found a better price elsewhere" },
    { value: "ordered_wrong_item", label: "Ordered wrong item/size/color" },
    { value: "ordered_by_mistake", label: "Ordered by mistake" },
    { value: "delivery_too_slow", label: "Delivery time is too long" },
    { value: "no_longer_needed", label: "No longer need the item" },
    { value: "quality_concerns", label: "Quality concerns" },
    { value: "payment_issue", label: "Payment/billing issue" },
    { value: "other", label: "Other reason" },
  ];

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/orders/profile/order/${id}`);
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

  // Calculate and update time remaining for cancellation
  useEffect(() => {
    if (!order?.createdAt) return;

    const updateTimeRemaining = () => {
      const orderTime = new Date(order.createdAt).getTime();
      const currentTime = Date.now();
      const oneHourInMs = 60 * 60 * 1000;
      const elapsed = currentTime - orderTime;
      const remaining = oneHourInMs - elapsed;

      if (remaining <= 0) {
        setTimeRemaining("");
        return;
      }

      const minutes = Math.floor(remaining / 60000);
      const seconds = Math.floor((remaining % 60000) / 1000);
      setTimeRemaining(`${minutes}m ${seconds}s`);
    };

    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [order]);

  // Check if order can be cancelled
  const canBeCancelled = () => {
    if (!order) return false;

    const oneHourInMs = 60 * 60 * 1000;
    const orderAge = Date.now() - new Date(order.createdAt).getTime();
    const withinTimeWindow = orderAge <= oneHourInMs;
    const validStatus = !["Cancelled", "Refunded", "Delivered"].includes(
      order.status,
    );

    return withinTimeWindow && validStatus;
  };

  const handleCancelOrder = async () => {
    if (!selectedReason) {
      toast.error("Please select a cancellation reason");
      return;
    }

    if (selectedReason === "other" && !cancellationReason.trim()) {
      toast.error("Please provide a reason for cancellation");
      return;
    }

    setIsCancelling(true);

    try {
      const reasonText =
        selectedReason === "other"
          ? cancellationReason
          : cancellationReasons.find((r) => r.value === selectedReason)?.label;

      const response = await axiosInstance.post(`/orders/${id}/cancel-order`, {
        cancellationReason: reasonText,
        email: order.email, // Required for guest orders
      });

      if (response.data.success) {
        toast.success(
          "Order cancelled successfully! Refund is being processed.",
        );
        setShowCancelModal(false);

        // Refresh order details to show updated status
        await fetchOrder();

        // Show refund information
        if (response.data.refund) {
          setTimeout(() => {
            toast.info(
              `Refund of ${formatAmountDefault(
                response.data.refund.currency,
                response.data.refund.amount,
              )} will appear in 5-10 business days`,
            );
          }, 1000);
        }
      }
    } catch (error: any) {
      console.error("Cancellation error:", error);

      if (error.response?.data?.windowExpired) {
        toast.error(
          "The 1-hour cancellation window has expired. Please contact support at hello@keesdeen.com",
        );
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to cancel order. Please try again.");
      }
    } finally {
      setIsCancelling(false);
    }
  };

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
      case "Refunded":
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
            <h1 className="mb-2 text-2xl font-light tracking-tight md:hidden md:text-3xl">
              Order - {order._id.slice(-8).toUpperCase()}
            </h1>
            <h1 className="mb-2 hidden text-2xl font-light tracking-tight md:block md:text-3xl">
              Order - {order._id.toUpperCase()}
            </h1>
            <p className="text-sm text-gray-500">
              Placed {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="text-left md:text-right">
            <div
              className={`mb-1 inline-block text-xs font-medium uppercase tracking-wider ${getStatusColor(
                order.status,
              )}`}
            >
              {order.status === "PartiallyRefunded"
                ? "Partially Refunded"
                : order.status}
            </div>
            <p className="text-sm text-gray-500">
              Paid {formatDate(order.paidAt)}
            </p>
          </div>
        </div>

        {/* Cancel Order Section */}
        {canBeCancelled() && (
          <div className="mt-6 border border-amber-200 bg-amber-50 p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="mb-1 text-sm font-medium text-amber-900">
                  You can still cancel this order
                </p>
                <p className="text-xs text-amber-700">
                  {timeRemaining && (
                    <span className="font-medium">
                      Time remaining: {timeRemaining}
                    </span>
                  )}
                  {!timeRemaining && (
                    <span>Free cancellation within 1 hour of order</span>
                  )}
                </p>
              </div>
              <button
                onClick={() => setShowCancelModal(true)}
                className="whitespace-nowrap border border-gray-900 bg-gray-900 hover:bg-gray-800 px-6 py-4 text-sm text-white font-medium uppercase tracking-wider transition-colors"
              >
                Cancel Order
              </button>
            </div>
          </div>
        )}

        {/* Cancelled/Refunded Status Message */}
        {(order.status === "Cancelled" || order.status === "Refunded") && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="mb-1 text-sm font-medium text-red-900">
              {order.status === "Cancelled"
                ? "Order Cancelled"
                : "Order Refunded"}
            </p>
            <p className="text-xs text-red-700">
              {order.refundInfo?.totalRefunded && (
                <span>
                  Refund of{" "}
                  {formatAmountDefault(
                    order.currency,
                    order.refundInfo.totalRefunded,
                  )}{" "}
                  will appear on your original payment method within 5-10
                  business days.
                </span>
              )}
            </p>
            {order.cancellationReason && (
              <p className="mt-2 text-xs text-red-600">
                Reason: {order.cancellationReason}
              </p>
            )}
          </div>
        )}
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
                    order.shippingAddress.country,
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
                    order.billingAddress.country,
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
                  order.totalPrice - order.shippingPrice,
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

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm px-4">
          <div className="relative w-full max-w-md border border-gray-300 bg-white p-6 shadow-xl">
            {/* Close button */}
            <button
              onClick={() => setShowCancelModal(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
              disabled={isCancelling}
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal content */}
            <h3 className="mb-2 text-xl sm:text-2xl font-light tracking-tight">
              Cancel Order
            </h3>
            <p className="mb-6 text-sm text-gray-600">
              This will cancel your order and process a full refund of{" "}
              <span className="font-medium">
                {formatAmountDefault(order.currency, order.totalPrice)}
              </span>
              . The refund will appear on your original payment method within
              5-10 business days.
            </p>

            {/* Reason selection */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium uppercase tracking-wider text-gray-700">
                Reason for cancellation
              </label>
              <select
                value={selectedReason}
                onChange={(e) => setSelectedReason(e.target.value)}
                className="w-full border border-gray-300 px-4 py-2 text-sm focus:border-gray-900 focus:outline-none"
                disabled={isCancelling}
              >
                <option value="">Select a reason</option>
                {cancellationReasons.map((reason) => (
                  <option key={reason.value} value={reason.value}>
                    {reason.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Custom reason textarea */}
            {selectedReason === "other" && (
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium uppercase tracking-wider text-gray-700">
                  Please specify
                </label>
                <textarea
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  placeholder="Tell us why you're cancelling..."
                  className="h-24 w-full resize-none border border-gray-300 px-4 py-2 text-sm focus:border-gray-900 focus:outline-none"
                  disabled={isCancelling}
                />
              </div>
            )}

            {/* Warning */}
            <div className="mb-6 border border-amber-200 bg-amber-50 p-3">
              <p className="text-xs text-amber-900">
                <strong>Note:</strong> This action cannot be undone. Once
                cancelled, you'll need to place a new order.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 border border-gray-300 px-4 py-4 text-sm font-medium uppercase tracking-wider text-gray-700 transition-colors hover:bg-gray-50"
                disabled={isCancelling}
              >
                Keep Order
              </button>
              <button
                onClick={handleCancelOrder}
                className="flex-1 border border-red-600 bg-red-600 px-4 py-4 text-sm font-medium uppercase tracking-wider text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isCancelling}
              >
                {isCancelling ? "Cancelling..." : "Cancel Order"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default OrderDetails;
