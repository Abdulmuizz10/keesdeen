import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowLeft,
  Package,
  CreditCard,
  Check,
  ChevronDown,
  Mail,
  Phone,
  Calendar,
  Truck,
  AlertCircle,
  Shield,
  Receipt,
  ExternalLink,
  Copy,
  Sparkles,
  User,
  Building2,
} from "lucide-react";
import Axios from "axios";
import { URL } from "@/lib/constants";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { Country, State } from "country-state-city";

// Types
interface OrderItem {
  name: string;
  qty: number;
  image: string;
  price: number;
  size: string;
  color: string;
  product: { $oid: string };
  _id: string;
}

interface Address {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  state: string;
  address1: string;
  address2: string;
  phone: string;
  postalCode: string;
}

interface PaymentInfo {
  squarePaymentId: string;
  squareOrderId?: string;
  paymentStatus: string;
  amountPaid: number;
  currency: string;
  paidAt?: string;
  receiptUrl?: string;
  receiptNumber?: string;
  paymentSourceType?: string;
  cardBrand?: string;
  cardLast4?: string;
  cardStatus?: string;
  riskLevel?: string;
  customerSquareId?: string;
  locationId?: string;
}

interface Order {
  _id: string;
  user: string;
  email: string;
  currency: string;
  coupon: string;
  orderedItems: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
  shippingPrice: number;
  totalPrice: number;
  paidAt: string;
  status: string;
  shippedAt: string | null;
  deliveredAt: string | null;
  createdAt: string;
  updatedAt: string;
  paymentInfo?: PaymentInfo;
}

const AdminOrderDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      const response = await Axios.get(`${URL}/orders/admin/order/${id}`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setOrder(response.data);
      }
    } catch (error) {
      toast.error("Failed to fetch order details");
      navigate("/admin/orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchOrderDetails();
    }
  }, [id]);

  const handleStatusChange = async (status: string) => {
    if (!order) return;

    setUpdating(true);
    try {
      const response = await Axios.patch(
        `${URL}/orders/admin/order/${order._id}/status`,
        { status },
        {
          withCredentials: true,
          validateStatus: (status: any) => status < 600,
        }
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        fetchOrderDetails();
      } else {
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number, currency: string = "GBP") => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      Pending:
        "bg-amber-50/50 text-amber-800 border-amber-200/60 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-900/40",

      Processing:
        "bg-sky-50/50 text-sky-800 border-sky-200/60 dark:bg-sky-950/30 dark:text-sky-300 dark:border-sky-900/40",

      Shipped:
        "bg-violet-50/50 text-violet-800 border-violet-200/60 dark:bg-violet-950/30 dark:text-violet-300 dark:border-violet-900/40",

      Delivered:
        "bg-emerald-50/50 text-emerald-800 border-emerald-200/60 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-900/40",

      Cancelled:
        "bg-rose-50/50 text-rose-800 border-rose-200/60 dark:bg-rose-950/30 dark:text-rose-300 dark:border-rose-900/40",
    };

    return (
      colors[status as keyof typeof colors] ||
      "bg-muted text-muted-foreground border-border"
    );
  };

  const getRiskLevelColor = (level?: string) => {
    if (!level) return "text-muted-foreground";
    const colors = {
      NORMAL: "text-green-600 dark:text-green-400",
      MODERATE: "text-yellow-600 dark:text-yellow-400",
      HIGH: "text-red-600 dark:text-red-400",
    };
    return colors[level as keyof typeof colors] || "text-muted-foreground";
  };

  const getCardBrandIcon = (brand?: string) => {
    const brandLower = brand?.toLowerCase() || "";
    if (brandLower.includes("visa")) return "💳";
    if (brandLower.includes("mastercard")) return "💳";
    if (brandLower.includes("amex")) return "💳";
    return "💳";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <Spinner className="size-12" />
          <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-foreground animate-pulse" />
        </div>
        <p className="text-sm text-muted-foreground animate-pulse">
          Loading order details...
        </p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto" />
          <p className="text-muted-foreground">Order not found</p>
        </div>
      </div>
    );
  }

  const subtotal = order.orderedItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <div className="p-4">
      {/*Header */}
      <div className="mb-5">
        <button
          onClick={() => navigate("/admin/orders")}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </button>
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl lg:text-5xl font-light tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                Order #{order._id.slice(-8).toUpperCase()}
              </h1>
              <button
                onClick={() => copyToClipboard(order._id, "Order ID")}
                className="p-2 hover:bg-muted rounded-sm transition-colors"
                title="Copy full order ID"
              >
                <Copy className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Placed {formatDate(order.createdAt)}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>{order.email}</span>
              </div>
            </div>
          </div>

          {/* Status Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger disabled={updating}>
              <div
                className={`inline-flex items-center gap-3 px-6 py-3 border-2 transition-all ${getStatusColor(
                  order.status
                )} ${
                  updating
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer hover:opacity-80"
                }`}
              >
                <span className="text-sm font-semibold tracking-wide">
                  {order.status}
                </span>
                <ChevronDown className="h-4 w-4" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-[--radix-dropdown-menu-trigger-width] rounded-none">
              {[
                "Pending",
                "Processing",
                "Shipped",
                "Delivered",
                "Cancelled",
              ].map((status) => (
                <DropdownMenuItem
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  className="flex items-center justify-between py-3"
                >
                  <span className="font-medium">{status}</span>
                  {order.status === status && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="h-px bg-gradient-to-r from-border via-border/50 to-transparent mt-8" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Content - Left Side */}
        <div className="xl:col-span-2 space-y-8">
          {/* Order Items */}
          <section className="border border-border bg-card">
            <div className="flex items-center gap-3 p-3 border-b border-border">
              <div className="p-2 bg-muted rounded-sm">
                <Package className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-light">Order Items</h2>
                <p className="text-xs text-muted-foreground">
                  {order.orderedItems.length} item
                  {order.orderedItems.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <div className="divide-y divide-border">
              {order.orderedItems.map((item) => (
                <div
                  key={item._id}
                  className="flex gap-4 p-3 hover:bg-muted/30 transition-colors group"
                >
                  <div className="relative w-24 h-24 flex-shrink-0 border border-border bg-muted/30 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium mb-2 truncate">{item.name}</h3>
                    <div className="flex flex-wrap gap-3 text-sm">
                      <span className="text-muted-foreground text-xs">
                        Size: {item.size}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        Color: {item.color}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        Qty: {item.qty}
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex flex-col justify-between">
                    <p className="text-lg">
                      {formatCurrency(item.price * item.qty, order.currency)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(item.price, order.currency)} each
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Payment Information */}
          {order.paymentInfo && (
            <section className="border border-border bg-card">
              <div className="flex items-center gap-3 p-6 border-b border-border">
                <div className="p-2 bg-muted rounded-sm">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-light">Payment Details</h2>
                  <p className="text-xs text-muted-foreground">
                    Square Payment Processing
                  </p>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Payment Status Banner */}
                <div
                  className={`flex items-center gap-3 p-4 border ${
                    order.paymentInfo.paymentStatus === "COMPLETED"
                      ? "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-700"
                      : "bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-900"
                  }`}
                >
                  <Check
                    className={`h-5 w-5 ${
                      order.paymentInfo.paymentStatus === "COMPLETED"
                        ? "text-green-600 dark:text-green-400"
                        : "text-yellow-600 dark:text-yellow-400"
                    }`}
                  />
                  <div>
                    <p className="font-semibold text-sm">
                      Payment {order.paymentInfo.paymentStatus}
                    </p>
                    <p className="text-xs opacity-80">
                      {formatCurrency(
                        order.paymentInfo.amountPaid,
                        order.paymentInfo.currency
                      )}{" "}
                      paid
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Payment Method */}
                  {order.paymentInfo.cardBrand && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Payment Method
                      </p>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-2xl">
                          {getCardBrandIcon(order.paymentInfo.cardBrand)}
                        </span>
                        <span className="font-medium">
                          {order.paymentInfo.cardBrand}
                        </span>
                        {order.paymentInfo.cardLast4 && (
                          <span className="text-muted-foreground">
                            •••• {order.paymentInfo.cardLast4}
                          </span>
                        )}
                      </div>
                      {order.paymentInfo.cardStatus && (
                        <p className="text-xs text-muted-foreground">
                          Status: {order.paymentInfo.cardStatus}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Risk Assessment */}
                  {order.paymentInfo.riskLevel && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Risk Level
                      </p>
                      <div className="flex items-center gap-2">
                        <Shield
                          className={`h-4 w-4 ${getRiskLevelColor(
                            order.paymentInfo.riskLevel
                          )}`}
                        />
                        <span
                          className={`font-semibold text-sm ${getRiskLevelColor(
                            order.paymentInfo.riskLevel
                          )}`}
                        >
                          {order.paymentInfo.riskLevel}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Receipt */}
                  {order.paymentInfo.receiptUrl && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Receipt
                      </p>
                      <a
                        href={order.paymentInfo.receiptUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                      >
                        <Receipt className="h-4 w-4" />
                        <span>View Receipt</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                      {order.paymentInfo.receiptNumber && (
                        <p className="text-xs text-muted-foreground">
                          #{order.paymentInfo.receiptNumber}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Payment Date */}
                  {order.paymentInfo.paidAt && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Payment Date
                      </p>
                      <p className="text-sm">
                        {formatDate(order.paymentInfo.paidAt)}
                      </p>
                    </div>
                  )}
                </div>

                {/* Transaction IDs */}
                <div className="pt-6 border-t border-border space-y-3">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Transaction Details
                  </p>
                  <div className="grid grid-cols-1 gap-3 font-mono text-xs">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-sm">
                      <span className="text-muted-foreground">Payment ID:</span>
                      <div className="flex items-center gap-2">
                        <span className="truncate max-w-[200px]">
                          {order.paymentInfo.squarePaymentId}
                        </span>
                        <button
                          onClick={() =>
                            copyToClipboard(
                              order.paymentInfo!.squarePaymentId,
                              "Payment ID"
                            )
                          }
                          className="p-1 hover:bg-background rounded"
                        >
                          <Copy className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    {order.paymentInfo.squareOrderId && (
                      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-sm">
                        <span className="text-muted-foreground">
                          Square Order ID:
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="truncate max-w-[200px]">
                            {order.paymentInfo.squareOrderId}
                          </span>
                          <button
                            onClick={() =>
                              copyToClipboard(
                                order.paymentInfo!.squareOrderId!,
                                "Square Order ID"
                              )
                            }
                            className="p-1 hover:bg-background rounded"
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Addresses */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Shipping Address */}
            <section className="border border-border bg-card">
              <div className="flex items-center gap-3 p-6 border-b border-border">
                <div className="p-2 bg-muted rounded-sm">
                  <Truck className="h-5 w-5" />
                </div>
                <h2 className="text-lg light">Shipping Address</h2>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <p className="mb-1">
                    {order.shippingAddress.firstName}{" "}
                    {order.shippingAddress.lastName}
                  </p>
                  <div className="space-y-1 text-sm text-muted-foreground">
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
                        ?.name || order.shippingAddress.country}{" "}
                      {order.shippingAddress.postalCode}
                    </p>
                  </div>
                </div>
                <div className="pt-4 border-t border-border space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {order.shippingAddress.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      +{order.shippingAddress.phone}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Billing Address */}
            <section className="border border-border bg-card">
              <div className="flex items-center gap-3 p-6 border-b border-border">
                <div className="p-2 bg-muted rounded-sm">
                  <Building2 className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-light">Billing Address</h2>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <p className="mb-1">
                    {order.billingAddress.firstName}{" "}
                    {order.billingAddress.lastName}
                  </p>
                  <div className="space-y-1 text-sm text-muted-foreground">
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
                        ?.name || order.billingAddress.country}{" "}
                      {order.billingAddress.postalCode}
                    </p>
                  </div>
                </div>
                <div className="pt-4 border-t border-border space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {order.billingAddress.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      +{order.billingAddress.phone}
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Sidebar - Right Side */}
        <div className="space-y-6">
          {/* Order Summary */}
          <section className="border border-border bg-card sticky top-4">
            <div className="p-3 border-b border-border">
              <h2 className="text-lg font-light flex items-center gap-2">
                Order Summary
              </h2>
            </div>

            <div className="p-3 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">
                  {formatCurrency(subtotal, order.currency)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium">
                  {order.shippingPrice === 0
                    ? "Free"
                    : formatCurrency(order.shippingPrice, order.currency)}
                </span>
              </div>
              {order.coupon && (
                <div className="flex justify-between text-sm p-2 bg-green-50 dark:bg-green-950 rounded-sm">
                  <span className="text-green-700 dark:text-green-400">
                    Coupon Applied
                  </span>
                  <span className="font-semibold text-green-700 dark:text-green-400">
                    {order.coupon}
                  </span>
                </div>
              )}
              <div className="pt-4 border-t border-border flex justify-between items-center">
                <span className="text-lg">Total</span>
                <span className="text-2xl font-light tracking-tight">
                  {formatCurrency(order.totalPrice, order.currency)}
                </span>
              </div>
            </div>
          </section>

          {/* Order Timeline */}
          <section className="border border-border bg-card">
            <div className="p-3 border-b border-border">
              <h2 className="text-lg font-light">Order Timeline</h2>
            </div>

            <div className="p-3 space-y-6">
              {/* Order Placed */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <div className="w-px h-full bg-border mt-2" />
                </div>
                <div className="pb-6 flex-1">
                  <p className="font-medium mb-1">Order Placed</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {formatDate(order.createdAt)}
                  </div>
                </div>
              </div>

              {/* Payment Confirmed */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <CreditCard
                    className={`h-5 w-5 ${
                      order.paidAt
                        ? "text-green-600 dark:text-green-400"
                        : "text-muted-foreground"
                    }`}
                  />
                  {(order.status === "Processing" ||
                    order.status === "Shipped" ||
                    order.status === "Delivered") && (
                    <div className="w-px h-full bg-border mt-2" />
                  )}
                </div>
                <div className="pb-6 flex-1">
                  <p className="font-medium mb-1">Payment Confirmed</p>
                  {order.paidAt && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {formatDate(order.paidAt)}
                    </div>
                  )}
                </div>
              </div>

              {/* Processing */}
              {(order.status === "Processing" ||
                order.status === "Shipped" ||
                order.status === "Delivered") && (
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <Truck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    {(order.status === "Shipped" ||
                      order.status === "Delivered") && (
                      <div className="w-px h-full bg-border mt-2" />
                    )}
                  </div>
                  <div className="pb-6 flex-1">
                    <p className="font-medium mb-1">Processing</p>
                    <p className="text-xs text-muted-foreground">
                      Order is being prepared
                    </p>
                  </div>
                </div>
              )}

              {/* Shipped */}
              {(order.status === "Shipped" || order.status === "Delivered") && (
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <Package className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    {order.status === "Delivered" && (
                      <div className="w-px h-full bg-border mt-2" />
                    )}
                  </div>
                  <div className="pb-6 flex-1">
                    <p className="font-medium mb-1">Shipped</p>
                    {order.shippedAt && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(order.shippedAt)}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Order is on its way
                    </p>
                  </div>
                </div>
              )}

              {/* Delivered */}
              {order.status === "Delivered" && (
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium mb-1">Delivered</p>
                    {order.deliveredAt && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatDate(order.deliveredAt)}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Cancelled */}
              {order.status === "Cancelled" && (
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium mb-1">Order Cancelled</p>
                    <p className="text-xs text-muted-foreground">
                      This order has been cancelled
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Customer Info */}
          <section className="border border-border bg-card">
            <div className="flex items-center gap-3 p-3 border-b border-border">
              <div className="p-2 bg-muted rounded-sm">
                <User className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-light">Customer Info</h2>
            </div>

            <div className="p-3 space-y-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                  Email
                </p>
                <p className="text-sm">{order.email}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                  Customer ID
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-mono">
                    {order.user.slice(-12).toUpperCase()}
                  </p>
                  <button
                    onClick={() => copyToClipboard(order.user, "Customer ID")}
                    className="p-1 hover:bg-muted rounded"
                  >
                    <Copy className="h-3 w-3" />
                  </button>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                  Order Date
                </p>
                <p className="text-sm">{formatDate(order.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                  Last Updated
                </p>
                <p className="text-sm">{formatDate(order.updatedAt)}</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetails;
