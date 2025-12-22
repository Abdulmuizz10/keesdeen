import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Check,
  ChevronDown,
  RefreshCw,
  X,
  AlertCircle,
} from "lucide-react";
import Axios from "axios";
import { URL } from "@/lib/constants";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { Link } from "react-router-dom";
import { formatAmountDefault } from "@/lib/utils";

interface OrderItem {
  name: string;
  qty: number;
  image: string;
  price: number;
  size: string;
  color: string;
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
  email: string;
  currency: string;
  orderedItems: OrderItem[];
  shippingAddress: Address;
  totalPrice: number;
  paidAt: string;
  status: string;
  createdAt: string;
  paymentInfo?: {
    amountPaid: number;
    squarePaymentId: string;
  };
  refundInfo?: {
    amountRefunded: number;
    status: string;
    refundType: string;
  };
}

const StatCard = ({ title, value, icon: Icon, status }: any) => (
  <div className="bg-card border border-border p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-3xl font-light tracking-tight mt-2">{value}</p>
      </div>
      <div
        className={`p-3 rounded-full ${
          status === "pending"
            ? "bg-yellow-100"
            : status === "delivered"
            ? "bg-green-100"
            : status === "cancelled"
            ? "bg-red-100"
            : "bg-muted"
        }`}
      >
        <Icon
          className={`h-5 w-5 ${
            status === "pending"
              ? "text-yellow-600"
              : status === "delivered"
              ? "text-green-600"
              : status === "cancelled"
              ? "text-red-600"
              : "text-muted-foreground"
          }`}
        />
      </div>
    </div>
  </div>
);

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Refund Modal State
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [refundType, setRefundType] = useState<"full" | "partial">("full");
  const [refundAmount, setRefundAmount] = useState("");
  const [refundReason, setRefundReason] = useState("");
  const [refundLoading, setRefundLoading] = useState(false);

  const stats = {
    total: orders?.length || 0,
    pending: orders?.filter((o) => o.status === "Pending").length || 0,
    delivered: orders?.filter((o) => o.status === "Delivered").length || 0,
    cancelled: orders?.filter((o) => o.status === "Cancelled").length || 0,
  };

  const fetchData = async (page: number) => {
    setLoading(true);
    try {
      const response = await Axios.get(
        `${URL}/orders/admin/pagination-orders?page=${page}`,
        { withCredentials: true }
      );
      if (response.status === 200) {
        setOrders(response.data.orders);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const handleStatusChange = async (orderId: string, status: string) => {
    setLoading(true);
    try {
      const response = await Axios.patch(
        `${URL}/orders/admin/order/${orderId}/status`,
        { status },
        {
          withCredentials: true,
          validateStatus: (status) => status < 600,
        }
      );
      if (response.status === 200) {
        fetchData(currentPage);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message || "Failed to update status");
      }
    } catch (error) {
      toast.error("Failed to update order status");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenRefundModal = (order: Order) => {
    setSelectedOrder(order);
    setRefundModalOpen(true);
    setRefundType("full");
    setRefundAmount("");
    setRefundReason("");
  };

  const handleCloseRefundModal = () => {
    setRefundModalOpen(false);
    setSelectedOrder(null);
    setRefundType("full");
    setRefundAmount("");
    setRefundReason("");
  };

  const handleRefundSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedOrder) return;

    if (!refundReason) {
      toast.error("Please select a refund reason");
      return;
    }

    const totalPaid =
      selectedOrder.paymentInfo?.amountPaid || selectedOrder.totalPrice;
    const alreadyRefunded = selectedOrder.refundInfo?.amountRefunded || 0;
    const maxRefund = totalPaid - alreadyRefunded;

    if (
      refundType === "partial" &&
      (!refundAmount || parseFloat(refundAmount) <= 0)
    ) {
      toast.error("Please enter a valid refund amount");
      return;
    }

    if (refundType === "partial" && parseFloat(refundAmount) > maxRefund) {
      toast.error(`Refund amount cannot exceed ${maxRefund.toFixed(2)}`);
      return;
    }

    setRefundLoading(true);

    try {
      const response = await Axios.post(
        `${URL}/orders/admin/refund/${selectedOrder._id}/create-refund`,
        {
          refundType,
          amount:
            refundType === "partial" ? parseFloat(refundAmount) : undefined,
          reason: refundReason,
        },
        {
          withCredentials: true,
          validateStatus: (status) => status < 600,
        }
      );

      if (response.data.success) {
        toast.success("Refund processed successfully");
        fetchData(currentPage);
        handleCloseRefundModal();
      } else {
        toast.error(response.data.message || "Refund failed");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to process refund");
    } finally {
      setRefundLoading(false);
    }
  };

  useEffect(() => {
    let filtered = [...orders];

    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.shippingAddress.firstName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          order.shippingAddress.lastName
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== "All") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [searchQuery, statusFilter, orders]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number, currency: string = "GBP") => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      Processing: "bg-blue-100 text-blue-800 border-blue-200",
      Shipped: "bg-indigo-300 text-indigo-800 border-indigo-200",
      Delivered: "bg-green-100 text-green-800 border-green-200",
      Cancelled: "bg-red-100 text-red-800 border-red-200",
      Refunded: "bg-purple-100 text-purple-800 border-purple-200",
      "Partially Refunded": "bg-orange-100 text-orange-800 border-orange-200",
    };

    return (
      <span
        className={`inline-flex items-center justify-center gap-2 px-3 h-10 text-xs font-medium border ${
          styles[status as keyof typeof styles] ||
          "bg-muted text-muted-foreground"
        }`}
      >
        {status}
        <ChevronDown className="h-4 w-4" />
      </span>
    );
  };

  const canRefund = (order: Order) => {
    const isFullyRefunded = order.status === "Refunded";
    const isCancelled = order.status === "Cancelled";
    return (
      !isFullyRefunded && !isCancelled && order.paymentInfo?.squarePaymentId
    );
  };

  // Calculate refund modal values
  const totalPaid =
    selectedOrder?.paymentInfo?.amountPaid || selectedOrder?.totalPrice || 0;
  const alreadyRefunded = selectedOrder?.refundInfo?.amountRefunded || 0;
  const maxRefund = totalPaid - alreadyRefunded;

  return (
    <div className="flex-1 space-y-4 p-4 bg-background">
      {/* HEADER */}
      <div className="mb-5 border-b border-border pb-8">
        <h1 className="text-2xl lg:text-5xl font-light tracking-tight mb-3">
          Orders Management
        </h1>
        <p className="text-sm text-muted-foreground">
          View and manage all customer orders
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Orders" value={stats.total} icon={Package} />
        <StatCard
          title="Pending"
          value={stats.pending}
          icon={Clock}
          status="pending"
        />
        <StatCard
          title="Delivered"
          value={stats.delivered}
          icon={CheckCircle}
          status="delivered"
        />
        <StatCard
          title="Cancelled"
          value={stats.cancelled}
          icon={XCircle}
          status="cancelled"
        />
      </div>

      {/* Filters */}
      <div className="bg-card border border-border p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by order ID, email, or customer name..."
              className="w-full pl-10 pr-4 py-2.5 bg-background border border-input text-sm focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="relative">
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full">
                <div className="relative flex items-center gap-2 pl-10 pr-8 py-2.5 bg-background border border-input text-sm cursor-pointer">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <span>{statusFilter}</span>
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="min-w-[--radix-dropdown-menu-trigger-width] mr-3 rounded-none">
                {[
                  "All",
                  "Pending",
                  "Processing",
                  "Shipped",
                  "Delivered",
                  "Cancelled",
                  "Refunded",
                  "Partially Refunded",
                ].map((status) => (
                  <DropdownMenuItem
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className="flex items-center justify-between"
                  >
                    {status}
                    {statusFilter === status && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-card border border-border">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Spinner className="size-6" />
          </div>
        ) : !filteredOrders || filteredOrders.length === 0 ? (
          <div className="text-center py-24">
            <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground">No orders found</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border">
                  <tr>
                    <th className="text-left p-6 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="text-left p-6 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="text-left p-6 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      Items
                    </th>
                    <th className="text-left p-6 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      Total
                    </th>
                    <th className="text-left p-6 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left p-6 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      Date
                    </th>
                    <th className="text-center p-6 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      Refund
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order, index) => (
                    <tr
                      key={order._id}
                      className={`border-b border-border hover:bg-muted/50 transition-colors ${
                        index === filteredOrders.length - 1 ? "border-b-0" : ""
                      }`}
                    >
                      <td className="p-6">
                        <div className="font-mono text-sm">
                          #{order._id.slice(-8).toUpperCase()}
                        </div>
                      </td>
                      <td className="p-6">
                        <Link to={`/admin/orders/order_details/${order._id}`}>
                          <div>
                            <div className="text-sm font-medium hover:underline">
                              {order.shippingAddress.firstName}{" "}
                              {order.shippingAddress.lastName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {order.email}
                            </div>
                          </div>
                        </Link>
                      </td>
                      <td className="p-6">
                        <div className="text-sm">
                          {order.orderedItems.reduce(
                            (sum, item) => sum + item.qty,
                            0
                          )}{" "}
                          items
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="space-y-1">
                          <div className="text-sm font-medium">
                            {formatCurrency(order.totalPrice, order.currency)}
                          </div>
                          {order.refundInfo &&
                            order.refundInfo.amountRefunded > 0 && (
                              <div className="text-xs text-red-600">
                                Refunded: -
                                {formatCurrency(
                                  order.refundInfo.amountRefunded,
                                  order.currency
                                )}
                              </div>
                            )}
                        </div>
                      </td>
                      <td className="p-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="w-fit">
                            {getStatusBadge(order.status)}
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] rounded-none">
                            {[
                              "Pending",
                              "Processing",
                              "Shipped",
                              "Delivered",
                              "Cancelled",
                            ].map((status) => (
                              <DropdownMenuItem
                                key={status}
                                onClick={() =>
                                  handleStatusChange(order._id, status)
                                }
                                className="flex items-center justify-between"
                              >
                                {status}
                                {order.status === status && (
                                  <Check className="h-4 w-4 text-primary" />
                                )}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                      <td className="p-6">
                        <div className="text-sm text-muted-foreground">
                          {formatDate(order.createdAt)}
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center justify-center gap-2">
                          {canRefund(order) ? (
                            <button
                              onClick={() => handleOpenRefundModal(order)}
                              className="p-2 border border-border hover:bg-muted transition-colors group"
                              title="Process Refund"
                            >
                              <RefreshCw className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                            </button>
                          ) : (
                            <button
                              disabled
                              className="p-2 border border-border opacity-50 cursor-not-allowed"
                              title="Refund not available"
                            >
                              <RefreshCw className="h-4 w-4 text-muted-foreground" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden divide-y divide-border">
              {filteredOrders.map((order) => (
                <div
                  key={order._id}
                  className="p-6 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="font-mono text-sm font-medium mb-1">
                        #{order._id.slice(-8).toUpperCase()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="w-fit">
                        {getStatusBadge(order.status)}
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-48 mr-10 rounded-none">
                        {[
                          "Pending",
                          "Processing",
                          "Shipped",
                          "Delivered",
                          "Cancelled",
                        ].map((status) => (
                          <DropdownMenuItem
                            key={status}
                            onClick={() =>
                              handleStatusChange(order._id, status)
                            }
                            className="flex items-center justify-between"
                          >
                            {status}
                            {order.status === status && (
                              <Check className="h-4 w-4 text-primary" />
                            )}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="space-y-2">
                    <Link to={`/admin/orders/order_details/${order._id}`}>
                      <div>
                        <div className="text-sm font-medium">
                          {order.shippingAddress.firstName}{" "}
                          {order.shippingAddress.lastName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {order.email}
                        </div>
                      </div>
                    </Link>

                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <span className="text-sm text-muted-foreground">
                        {order.orderedItems.reduce(
                          (sum, item) => sum + item.qty,
                          0
                        )}{" "}
                        items
                      </span>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {formatCurrency(order.totalPrice, order.currency)}
                        </div>
                        {order.refundInfo &&
                          order.refundInfo.amountRefunded > 0 && (
                            <div className="text-xs text-red-600">
                              Refunded: -
                              {formatCurrency(
                                order.refundInfo.amountRefunded,
                                order.currency
                              )}
                            </div>
                          )}
                      </div>
                    </div>

                    {canRefund(order) && (
                      <button
                        onClick={() => handleOpenRefundModal(order)}
                        className="w-full mt-3 p-2 border border-border hover:bg-muted transition-colors flex items-center justify-center gap-2 text-sm"
                      >
                        <RefreshCw className="h-4 w-4" />
                        Process Refund
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Pagination */}
        {!loading && filteredOrders && filteredOrders.length > 0 && (
          <div className="mt-16 flex items-center justify-between border-t border-border pt-8 px-6 pb-6">
            <button
              className={`text-sm uppercase tracking-widest transition-colors ${
                currentPage === 1
                  ? "cursor-not-allowed text-muted-foreground"
                  : "text-foreground hover:text-muted-foreground"
              }`}
              disabled={currentPage === 1}
              onClick={() => {
                setCurrentPage((prev) => Math.max(prev - 1, 1));
                window.scrollTo({ top: 0, behavior: "instant" });
              }}
            >
              Previous
            </button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className={`text-sm uppercase tracking-widest transition-colors ${
                currentPage === totalPages
                  ? "cursor-not-allowed text-muted-foreground"
                  : "text-foreground hover:text-muted-foreground"
              }`}
              disabled={currentPage === totalPages}
              onClick={() => {
                setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                window.scrollTo({ top: 0, behavior: "instant" });
              }}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* REFUND MODAL */}
      {refundModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full bg-background max-w-lg border border-border">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border p-6">
              <h2 className="text-xl font-light">Process Refund</h2>
              <button
                onClick={handleCloseRefundModal}
                className="text-muted-foreground hover:text-foreground transition-colors"
                disabled={refundLoading}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Order Info */}
              <div className="mb-6 space-y-2 bg-muted/70 p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Order ID:</span>
                  <span className="font-mono">
                    #{selectedOrder._id.slice(-8).toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Original Amount:
                  </span>
                  <span className="font-medium">
                    {formatAmountDefault(selectedOrder.currency, totalPaid)}
                  </span>
                </div>
                {alreadyRefunded > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Already Refunded:
                    </span>
                    <span className="text-red-600">
                      -
                      {formatAmountDefault(
                        selectedOrder.currency,
                        alreadyRefunded
                      )}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-medium border-t border-border pt-2 mt-2">
                  <span>Available for Refund:</span>
                  <span className="text-green-400 text-base">
                    {formatAmountDefault(selectedOrder.currency, maxRefund)}
                  </span>
                </div>
              </div>

              {/* Alert */}
              {alreadyRefunded > 0 && (
                <div className="mb-6 flex gap-3 bg-yellow-50 border border-yellow-200 p-4">
                  <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    This order has been partially refunded. You can only refund
                    the remaining amount.
                  </div>
                </div>
              )}

              <form onSubmit={handleRefundSubmit} className="space-y-6">
                {/* Refund Type */}
                <div>
                  <label className="block text-sm font-medium mb-3">
                    Refund Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRefundType("full")}
                      className={`p-4 text-sm transition-colors ${
                        refundType === "full"
                          ? "border-b-2 border-primary"
                          : "border-b"
                      }`}
                    >
                      <div className="font-medium mb-1">Full Refund</div>
                      <div className={"text-muted-foreground"}>
                        {selectedOrder.currency} {maxRefund.toFixed(2)}
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRefundType("partial")}
                      className={`p-4 text-sm transition-colors ${
                        refundType === "partial"
                          ? "border-b-2 border-primary"
                          : "border-b"
                      }`}
                    >
                      <div className="font-medium mb-1">Partial Refund</div>
                      <div className={"text-muted-foreground"}>
                        Custom amount
                      </div>
                    </button>
                  </div>
                </div>

                {/* Amount Input (for partial) */}
                {refundType === "partial" && (
                  <div>
                    <label
                      htmlFor="amount"
                      className="block text-sm font-medium mb-2"
                    >
                      Refund Amount
                    </label>
                    <div className="relative">
                      <input
                        id="amount"
                        type="number"
                        step="0.01"
                        max={maxRefund}
                        value={refundAmount}
                        onChange={(e) => setRefundAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full px-2 py-2.5 bg-background border border-input text-sm focus:outline-none focus:ring-1 focus:ring-black"
                        required
                      />
                    </div>
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      Maximum:{" "}
                      {formatAmountDefault(selectedOrder.currency, maxRefund)}{" "}
                      already Refunded
                    </p>
                  </div>
                )}

                {/* Reason */}
                <div>
                  <label
                    htmlFor="reason"
                    className="block text-sm font-medium mb-2"
                  >
                    Refund Reason
                  </label>
                  <select
                    id="reason"
                    value={refundReason}
                    onChange={(e) => setRefundReason(e.target.value)}
                    className="w-full px-4 py-2.5 bg-background border border-input text-sm focus:outline-none focus:ring-1 focus:ring-black"
                    required
                  >
                    <option value="">Select a reason...</option>
                    <option value="Customer requested refund">
                      Customer requested refund
                    </option>
                    <option value="Item out of stock">Item out of stock</option>
                    <option value="Defective product">Defective product</option>
                    <option value="Wrong item shipped">
                      Wrong item shipped
                    </option>
                    <option value="Duplicate order">Duplicate order</option>
                    <option value="Shipping delay">Shipping delay</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseRefundModal}
                    disabled={refundLoading}
                    className="flex-1 px-4 py-3 text-sm border border-border text-foreground hover:bg-muted transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={refundLoading}
                    className="flex-1 px-4 py-3 text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {refundLoading ? (
                      <>
                        <Spinner className="h-4 w-4" />
                        Processing...
                      </>
                    ) : (
                      "Process Refund"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
