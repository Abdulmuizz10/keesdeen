import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Check,
  RefreshCw,
  Eye,
  Calendar,
  Clock,
  AlertCircle,
  TrendingDown,
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import Axios from "axios";
import { URL } from "@/lib/constants";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Types
interface RefundData {
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  refundAmount: number;
  originalAmount: number;
  currency: string;
  reason: string;
  refundType: string;
  status: string;
  requestedDate: string;
  completedDate?: string;
  squareRefundId?: string;
}

interface RefundStats {
  total: number;
  pending: number;
  completed: number;
  rejected: number;
  failed: number;
  totalAmount: number;
  averageAmount: number;
}

// Stat Card Component
const RefundStatCard = ({
  title,
  value,
  icon: Icon,
  color,
  subtitle,
}: {
  title: string;
  value: string | number;
  icon: any;
  color: string;
  subtitle?: string;
}) => (
  <div className="bg-card border border-border p-6">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-3xl font-light tracking-tight mt-2">{value}</p>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
    </div>
  </div>
);

const AdminRefunds: React.FC = () => {
  const [refunds, setRefunds] = useState<RefundData[]>([]);
  const [filteredRefunds, setFilteredRefunds] = useState<RefundData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState<RefundStats>({
    total: 0,
    pending: 0,
    completed: 0,
    rejected: 0,
    failed: 0,
    totalAmount: 0,
    averageAmount: 0,
  });

  const fetchRefunds = async (page: number) => {
    setLoading(true);
    try {
      const response = await Axios.get(
        `${URL}/orders/admin/refund/pagination-order-refunds?page=${page}`,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        // Filter orders that have refund info and map to refund data
        const ordersWithRefunds = response.data.orders
          .filter((order: any) => order.refundInfo)
          .map((order: any) => ({
            orderId: order._id,
            orderNumber: order._id.slice(-8).toUpperCase(),
            customerName: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
            customerEmail: order.email,
            refundAmount: order.refundInfo.amountRefunded || 0,
            originalAmount: order.paymentInfo?.amountPaid || order.totalPrice,
            currency: order.currency || "GBP",
            reason: order.refundInfo.reason || "No reason provided",
            refundType: order.refundInfo.refundType || "full",
            status: order.refundInfo.status || "PENDING",
            requestedDate: order.refundInfo.refundedAt || order.createdAt,
            completedDate: order.refundInfo.refundedAt,
            squareRefundId: order.refundInfo.squareRefundId,
          }))
          .sort(
            (a: RefundData, b: RefundData) =>
              new Date(b.requestedDate).getTime() -
              new Date(a.requestedDate).getTime()
          );

        setRefunds(ordersWithRefunds);
        setTotalPages(response.data.totalPages);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch refunds");
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats separately (all refunds for accurate stats)
  const fetchStats = async () => {
    try {
      const response = await Axios.get(`${URL}/orders/admin/all-orders`, {
        withCredentials: true,
      });

      if (response.status === 200) {
        const ordersWithRefunds = response.data.orders.filter(
          (order: any) => order.refundInfo
        );

        const calculatedStats = {
          total: ordersWithRefunds.length,
          pending: ordersWithRefunds.filter(
            (order: any) => order.refundInfo.status === "PENDING"
          ).length,
          completed: ordersWithRefunds.filter(
            (order: any) => order.refundInfo.status === "COMPLETED"
          ).length,
          rejected: ordersWithRefunds.filter(
            (order: any) => order.refundInfo.status === "REJECTED"
          ).length,
          failed: ordersWithRefunds.filter(
            (order: any) => order.refundInfo.status === "FAILED"
          ).length,
          totalAmount: ordersWithRefunds
            .filter((order: any) => order.refundInfo.status === "COMPLETED")
            .reduce(
              (sum: number, order: any) =>
                sum + (order.refundInfo.amountRefunded || 0),
              0
            ),
          averageAmount:
            ordersWithRefunds.length > 0
              ? ordersWithRefunds.reduce(
                  (sum: number, order: any) =>
                    sum + (order.refundInfo.amountRefunded || 0),
                  0
                ) / ordersWithRefunds.length
              : 0,
        };

        setStats(calculatedStats);
      }
    } catch (error) {
      toast.error("Failed to fetch stats");
    }
  };

  useEffect(() => {
    fetchRefunds(currentPage);
    fetchStats(); // Fetch stats once on mount
  }, [currentPage]);

  // Filter refunds based on search and status (client-side filtering)
  useEffect(() => {
    let filtered = [...refunds];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (refund) =>
          refund.customerEmail.toLowerCase().includes(query) ||
          refund.customerName.toLowerCase().includes(query) ||
          refund.orderNumber.toLowerCase().includes(query) ||
          refund.orderId.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== "All") {
      filtered = filtered.filter((refund) => refund.status === statusFilter);
    }

    setFilteredRefunds(filtered);
  }, [searchQuery, statusFilter, refunds]);

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format currency
  const formatCurrency = (amount: number, currency: string = "GBP") => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const styles = {
      PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
      COMPLETED: "bg-green-100 text-green-800 border-green-200",
      REJECTED: "bg-red-100 text-red-800 border-red-200",
      FAILED: "bg-gray-100 text-gray-800 border-gray-200",
    };

    const icons = {
      PENDING: Clock,
      COMPLETED: Check,
      REJECTED: AlertCircle,
      FAILED: AlertCircle,
    };

    const Icon = icons[status as keyof typeof icons] || AlertCircle;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium border ${
          styles[status as keyof typeof styles] ||
          "bg-muted text-muted-foreground border-border"
        }`}
      >
        <Icon className="h-3 w-3" />
        {status}
      </span>
    );
  };

  // Get refund type badge
  const getRefundTypeBadge = (type: string) => {
    return (
      <span
        className={`inline-flex items-center px-2 py-1 text-xs font-medium ${
          type === "full"
            ? "bg-blue-50 text-blue-700 border border-blue-200"
            : "bg-purple-50 text-purple-700 border border-purple-200"
        }`}
      >
        {type === "full" ? "Full Refund" : "Partial Refund"}
      </span>
    );
  };

  return (
    <div className="flex-1 space-y-4 p-4 bg-background">
      {/* HEADER */}
      <div className="mb-5 border-b border-border pb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-5xl font-light tracking-tight mb-3">
              Refunds Management
            </h1>
            <p className="text-sm text-muted-foreground">
              View and track all refund requests and transactions
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <RefundStatCard
          title="Total Refunds"
          value={stats.total}
          icon={RefreshCw}
          color="bg-blue-100 text-blue-600"
          subtitle={`${stats.completed} completed`}
        />
        <RefundStatCard
          title="Pending Review"
          value={stats.pending}
          icon={Calendar}
          color="bg-yellow-100 text-yellow-600"
          subtitle="Awaiting processing"
        />
        <RefundStatCard
          title="Total Refunded"
          value={formatCurrency(stats.totalAmount)}
          icon={TrendingDown}
          color="bg-purple-100 text-purple-600"
          subtitle={`Avg: ${formatCurrency(stats.averageAmount)}`}
        />
        <RefundStatCard
          title="Success Rate"
          value={
            stats.total > 0
              ? `${Math.round((stats.completed / stats.total) * 100)}%`
              : "0%"
          }
          icon={Check}
          color="bg-green-100 text-green-600"
          subtitle={`${stats.rejected + stats.failed} failed/rejected`}
        />
      </div>

      {/* Filters */}
      <div className="bg-card border border-border p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by order ID, email, or customer name..."
              className="w-full pl-10 pr-4 py-2.5 bg-background border border-input text-sm focus:outline-none focus:ring-1 focus:ring-black"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div className="relative lg:w-48">
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full">
                <div className="relative flex items-center gap-2 pl-10 pr-8 py-2.5 bg-background border border-input text-sm cursor-pointer transition-colors">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <span className="flex-1 text-left">{statusFilter}</span>
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="min-w-[--radix-dropdown-menu-trigger-width] mr-3 rounded-none">
                {["All", "PENDING", "COMPLETED", "REJECTED", "FAILED"].map(
                  (status) => (
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
                  )
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => {
              fetchRefunds(currentPage);
              fetchStats();
            }}
            disabled={loading}
            className="px-6 py-2.5 border border-border hover:bg-muted transition-colors flex items-center justify-center gap-2 text-sm uppercase tracking-widest disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden lg:inline">Refresh</span>
          </button>
        </div>

        {/* Active Filters Info */}
        {(searchQuery || statusFilter !== "All") && (
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="h-4 w-4" />
            <span>
              Showing {filteredRefunds.length} of {refunds.length} refunds on
              this page
            </span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="ml-2 text-xs underline hover:no-underline"
              >
                Clear search
              </button>
            )}
            {statusFilter !== "All" && (
              <button
                onClick={() => setStatusFilter("All")}
                className="ml-2 text-xs underline hover:no-underline"
              >
                Clear filter
              </button>
            )}
          </div>
        )}
      </div>

      {/* Refunds Table */}
      <div className="bg-card border border-border">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Spinner className="size-8 mb-4" />
            <p className="text-sm text-muted-foreground">Loading refunds...</p>
          </div>
        ) : !filteredRefunds || filteredRefunds.length === 0 ? (
          <div className="text-center py-24">
            <RefreshCw className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground mb-2">
              {refunds.length === 0
                ? "No refunds on this page"
                : "No refunds match your search"}
            </p>
            <p className="text-sm text-muted-foreground">
              {refunds.length === 0
                ? "Try navigating to other pages or check back later"
                : "Try adjusting your search or filter criteria"}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border bg-muted/30">
                  <tr>
                    <th className="text-left p-6 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="text-left p-6 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="text-left p-6 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="text-left p-6 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      Type
                    </th>
                    <th className="text-left p-6 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      Reason
                    </th>
                    <th className="text-left p-6 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left p-6 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      Date
                    </th>
                    <th className="text-center p-6 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRefunds.map((refund, index) => (
                    <tr
                      key={refund.orderId}
                      className={`border-b border-border hover:bg-muted/50 transition-colors ${
                        index === filteredRefunds.length - 1 ? "border-b-0" : ""
                      }`}
                    >
                      <td className="p-6">
                        <div className="font-mono text-sm font-medium">
                          #{refund.orderNumber}
                        </div>
                        {refund.squareRefundId && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {refund.squareRefundId.slice(0, 16)}...
                          </div>
                        )}
                      </td>
                      <td className="p-6">
                        <div>
                          <div className="text-sm font-medium">
                            {refund.customerName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {refund.customerEmail}
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-red-600">
                            -
                            {formatCurrency(
                              refund.refundAmount,
                              refund.currency
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            of{" "}
                            {formatCurrency(
                              refund.originalAmount,
                              refund.currency
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        {getRefundTypeBadge(refund.refundType)}
                      </td>
                      <td className="p-6">
                        <div className="text-sm text-muted-foreground max-w-[200px]">
                          <div className="truncate" title={refund.reason}>
                            {refund.reason}
                          </div>
                        </div>
                      </td>
                      <td className="p-6">{getStatusBadge(refund.status)}</td>
                      <td className="p-6">
                        <div className="text-sm text-muted-foreground">
                          {formatDate(refund.requestedDate)}
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center justify-center">
                          <Link
                            to={`/admin/orders/order_details/${refund.orderId}`}
                            className="p-2 border border-border hover:bg-muted transition-colors group"
                            title="View Order Details"
                          >
                            <Eye className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden divide-y divide-border">
              {filteredRefunds.map((refund) => (
                <div
                  key={refund.orderId}
                  className="p-6 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="font-mono text-sm font-medium mb-1">
                        #{refund.orderNumber}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(refund.requestedDate)}
                      </div>
                    </div>
                    {getStatusBadge(refund.status)}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="text-sm font-medium">
                        {refund.customerName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {refund.customerEmail}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-border">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">
                          Refund Amount
                        </div>
                        <div className="text-sm font-medium text-red-600">
                          -
                          {formatCurrency(refund.refundAmount, refund.currency)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          of{" "}
                          {formatCurrency(
                            refund.originalAmount,
                            refund.currency
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">
                          Type
                        </div>
                        {getRefundTypeBadge(refund.refundType)}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-muted-foreground mb-1">
                        Reason
                      </div>
                      <div className="text-sm">{refund.reason}</div>
                    </div>

                    <Link
                      to={`/admin/orders/order_details/${refund.orderId}`}
                      className="w-full mt-3 p-2.5 border border-border hover:bg-muted transition-colors flex items-center justify-center gap-2 text-sm uppercase tracking-widest"
                    >
                      <Eye className="h-4 w-4" />
                      View Order
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Pagination */}
        {!loading && filteredRefunds && filteredRefunds.length > 0 && (
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

      {/* Summary Footer */}
      {!loading && filteredRefunds.length > 0 && (
        <div className="bg-card border border-border p-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-medium text-foreground">
                {filteredRefunds.length}
              </span>{" "}
              refunds on this page • Total across all pages:{" "}
              <span className="font-medium text-foreground">{stats.total}</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="text-muted-foreground">
                Total Refunded (All):{" "}
                <span className="font-medium text-foreground">
                  {formatCurrency(stats.totalAmount)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRefunds;
