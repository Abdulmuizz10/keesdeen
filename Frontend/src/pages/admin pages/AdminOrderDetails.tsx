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
  MapPin,
  CreditCard,
  Check,
  ChevronDown,
  Mail,
  Phone,
  Calendar,
  Truck,
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
  isDelivered: string;
  deliveredAt: string | null;
  createdAt: string;
  updatedAt: string;
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
      Pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
      Processing: "bg-blue-50 text-blue-700 border-blue-200",
      Delivered: "bg-green-50 text-green-700 border-green-200",
      Cancelled: "bg-red-50 text-red-700 border-red-200",
    };
    return (
      colors[status as keyof typeof colors] ||
      "bg-muted text-muted-foreground border-border"
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Order not found</p>
      </div>
    );
  }

  const subtotal = order.orderedItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-5 border-b border-border pb-8">
          <button
            onClick={() => navigate("/admin/orders")}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </button>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl lg:text-5xl font-light tracking-tight mb-3">
                Order Details
              </h1>
              <p className="text-sm text-muted-foreground font-mono">
                #{order._id.slice(-8).toUpperCase()}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger disabled={updating}>
                  <div
                    className={`inline-flex items-center gap-2 px-6 py-3 border transition-colors ${getStatusColor(
                      order.isDelivered
                    )} ${
                      updating
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer hover:opacity-80"
                    }`}
                  >
                    <span className="text-sm font-medium">
                      {order.isDelivered}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 rounded-none">
                  {["Pending", "Processing", "Delivered", "Cancelled"].map(
                    (status) => (
                      <DropdownMenuItem
                        key={status}
                        onClick={() => handleStatusChange(status)}
                        className="flex items-center justify-between"
                      >
                        {status}
                        {order.isDelivered === status && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </DropdownMenuItem>
                    )
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Items */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-border">
                <Package className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-xl font-light tracking-tight">
                  Order Items
                </h2>
              </div>

              <div className="space-y-4">
                {order.orderedItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex gap-4 p-4 border border-border hover:bg-muted/30 transition-colors"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover border border-border"
                    />
                    <div className="flex-1">
                      <h3 className="text-sm font-medium mb-2">{item.name}</h3>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span>Size: {item.size}</span>
                        <span>Color: {item.color}</span>
                        <span>Qty: {item.qty}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {formatCurrency(item.price * item.qty, order.currency)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Shipping Address */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-border">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-xl font-light tracking-tight">
                  Shipping Address
                </h2>
              </div>

              <div className="p-6 border border-border space-y-3">
                <p className="text-sm font-medium">
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
                <div className="pt-3 border-t border-border space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    {order.shippingAddress.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />+{order.shippingAddress.phone}
                  </div>
                </div>
              </div>
            </section>

            {/* Billing Address */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-border">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-xl font-light tracking-tight">
                  Billing Address
                </h2>
              </div>

              <div className="p-6 border border-border space-y-3">
                <p className="text-sm font-medium">
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
                <div className="pt-3 border-t border-border space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    {order.billingAddress.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />+{order.billingAddress.phone}
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Order Summary */}
            <section className="p-6 border border-border space-y-6">
              <h2 className="text-xl font-light tracking-tight pb-4 border-b border-border">
                Order Summary
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(subtotal, order.currency)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>
                    {order.shippingPrice === 0
                      ? "Free"
                      : formatCurrency(order.shippingPrice, order.currency)}
                  </span>
                </div>
                {order.coupon && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Coupon</span>
                    <span className="text-green-600">{order.coupon}</span>
                  </div>
                )}
                <div className="pt-3 border-t border-border flex justify-between tracking-widest">
                  <span className="font-medium">Total</span>
                  <span className="font-medium text-lg">
                    {formatCurrency(order.totalPrice, order.currency)}
                  </span>
                </div>
              </div>
            </section>

            {/* Order Timeline */}
            <section className="p-6 border border-border space-y-6">
              <h2 className="text-xl font-light tracking-tight pb-4 border-b border-border">
                Order Timeline
              </h2>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="w-px h-full bg-border mt-2" />
                  </div>
                  <div className="pb-6">
                    <p className="text-sm font-medium mb-1">Order Placed</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {formatDate(order.createdAt)}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        order.paidAt ? "bg-green-100" : "bg-muted"
                      }`}
                    >
                      <CreditCard
                        className={`h-4 w-4 ${
                          order.paidAt
                            ? "text-green-600"
                            : "text-muted-foreground"
                        }`}
                      />
                    </div>
                    {(order.isDelivered === "Processing" ||
                      order.isDelivered === "Delivered") && (
                      <div className="w-px h-full bg-border mt-2" />
                    )}
                  </div>
                  <div className="pb-6">
                    <p className="text-sm font-medium mb-1">
                      Payment Confirmed
                    </p>
                    {order.paidAt && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatDate(order.paidAt)}
                      </div>
                    )}
                  </div>
                </div>

                {(order.isDelivered === "Processing" ||
                  order.isDelivered === "Delivered") && (
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <Truck className="h-4 w-4 text-blue-600" />
                      </div>
                      {order.isDelivered === "Delivered" && (
                        <div className="w-px h-full bg-border mt-2" />
                      )}
                    </div>
                    <div className="pb-6">
                      <p className="text-sm font-medium mb-1">
                        Order Processing
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Your order is being prepared
                      </p>
                    </div>
                  </div>
                )}

                {order.isDelivered === "Delivered" && (
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <Check className="h-4 w-4 text-green-600" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Delivered</p>
                      {order.deliveredAt && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {formatDate(order.deliveredAt)}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {order.isDelivered === "Cancelled" && (
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                        <span className="text-red-600 text-lg">×</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">
                        Order Cancelled
                      </p>
                      <p className="text-xs text-muted-foreground">
                        This order has been cancelled
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Customer Info */}
            <section className="p-6 border border-border space-y-4">
              <h2 className="text-xl font-light tracking-tight pb-4 border-b border-border">
                Customer Information
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Customer Email
                  </p>
                  <p className="text-sm">{order.email}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Customer ID
                  </p>
                  <p className="text-sm font-mono">
                    {order.user.slice(-12).toUpperCase()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Order Date
                  </p>
                  <p className="text-sm">{formatDate(order.createdAt)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Last Updated
                  </p>
                  <p className="text-sm">{formatDate(order.updatedAt)}</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetails;
