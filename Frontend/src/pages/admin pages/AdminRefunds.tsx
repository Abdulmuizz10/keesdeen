import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Check,
  Eye,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import Axios from "axios";
import { URL } from "@/lib/constants";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { Link } from "react-router-dom";

// Types
interface Order {
  _id: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
  };
  totalPrice: number;
  currency: string;
  status: string;
  createdAt: string;
}

interface Refund {
  _id: string;
  orderId: Order;
  paymentId: string;
  squareRefundId?: string;
  amount: number;
  currency: string;
  reason: string;
  status: string;
  failureReason?: string;
  initiatedBy: string;
  customerEmail: string;
  refundedAt?: string;
  createdAt: string;
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
            : status === "completed"
            ? "bg-green-100"
            : status === "failed"
            ? "bg-red-100"
            : status === "processing"
            ? "bg-blue-100"
            : "bg-muted"
        }`}
      >
        <Icon
          className={`h-5 w-5 ${
            status === "pending"
              ? "text-yellow-600"
              : status === "completed"
              ? "text-green-600"
              : status === "failed"
              ? "text-red-600"
              : status === "processing"
              ? "text-blue-600"
              : "text-muted-foreground"
          }`}
        />
      </div>
    </div>
  </div>
);

const AdminRefunds: React.FC = () => {
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [filteredRefunds, setFilteredRefunds] = useState<Refund[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Stats calculation
  const stats = {
    total: refunds?.length || 0,
    pending: refunds?.filter((r) => r.status === "pending").length || 0,
    completed: refunds?.filter((r) => r.status === "completed").length || 0,
    failed: refunds?.filter((r) => r.status === "failed").length || 0,
  };

  const fetchData = async (page: number) => {
    setLoading(true);
    try {
      const response = await Axios.get(
        `${URL}/refunds/admin/pagination-refunds?page=${page}`,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        setRefunds(response.data.refunds);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const handleStatusChange = async (refundId: string, status: string) => {
    setLoading(true);
    try {
      const response = await Axios.patch(
        `${URL}/refunds/admin/refund/${refundId}/status`,
        { status },
        {
          withCredentials: true,
          validateStatus: (status: any) => status < 600,
        }
      );
      if (response.status === 200) {
        fetchData(currentPage);
        toast.success(
          response.data.message || "Refund status updated successfully"
        );
      } else {
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Filter refunds
  useEffect(() => {
    let filtered = [...refunds];

    if (searchQuery) {
      filtered = filtered.filter(
        (refund) =>
          refund.customerEmail
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          refund._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          refund.orderId?._id
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          refund.orderId?.shippingAddress.firstName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          refund.orderId?.shippingAddress.lastName
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== "All") {
      filtered = filtered.filter((refund) => refund.status === statusFilter);
    }

    setFilteredRefunds(filtered);
  }, [searchQuery, statusFilter, refunds]);

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
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      processing: "bg-blue-100 text-blue-800 border-blue-200",
      completed: "bg-green-100 text-green-800 border-green-200",
      failed: "bg-red-100 text-red-800 border-red-200",
      rejected: "bg-gray-100 text-gray-800 border-gray-200",
    };

    return (
      <span
        className={`inline-flex items-center justify-center gap-3 w-32 h-10 text-xs font-medium border ${
          styles[status as keyof typeof styles] ||
          "bg-muted text-muted-foreground"
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
        <ChevronDown className="h-4 w-4" />
      </span>
    );
  };

  return (
    <div className="flex-1 space-y-4 p-4 bg-background">
      {/* HEADER */}
      <div className="mb-5 border-b border-border pb-8">
        <h1 className="text-2xl lg:text-5xl font-light tracking-tight mb-3">
          Refunds Management
        </h1>
        <p className="text-sm text-muted-foreground">
          View and manage all refund requests
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Refunds" value={stats.total} icon={RefreshCw} />
        <StatCard
          title="Pending"
          value={stats.pending}
          icon={Clock}
          status="pending"
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          icon={CheckCircle}
          status="completed"
        />
        <StatCard
          title="Failed"
          value={stats.failed}
          icon={XCircle}
          status="failed"
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
              placeholder="Search by refund ID, order ID, email, or customer name..."
              className="w-full pl-10 pr-4 py-2.5 bg-background border border-input text-sm focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Status Filter */}
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
                  "pending",
                  "processing",
                  "completed",
                  "failed",
                  "rejected",
                ].map((status) => (
                  <DropdownMenuItem
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className="flex items-center justify-between"
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
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

      {/* Refunds Table */}
      <div className="bg-card border border-border">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Spinner className="size-6" />
          </div>
        ) : !filteredRefunds || filteredRefunds.length === 0 ? (
          <div className="text-center py-24">
            <RefreshCw className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground">No refunds found</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border">
                  <tr>
                    <th className="text-left p-6 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      Refund ID
                    </th>
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
                      Status
                    </th>
                    <th className="text-left p-6 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      Date
                    </th>
                    <th className="text-left p-6 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRefunds.map((refund, index) => (
                    <tr
                      key={refund._id}
                      className={`border-b border-border hover:bg-muted/50 transition-colors ${
                        index === filteredRefunds.length - 1 ? "border-b-0" : ""
                      }`}
                    >
                      <td className="p-6">
                        <div className="font-mono text-sm">
                          #{refund._id.slice(-8).toUpperCase()}
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="font-mono text-sm text-primary hover:underline">
                          #{refund.orderId?._id.slice(-8).toUpperCase()}
                        </div>
                      </td>
                      <td className="p-6">
                        <div>
                          <div className="text-sm font-medium">
                            {refund.orderId?.shippingAddress.firstName}{" "}
                            {refund.orderId?.shippingAddress.lastName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {refund.customerEmail}
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="text-sm font-medium">
                          {formatCurrency(refund.amount, refund.currency)}
                        </div>
                      </td>
                      <td className="p-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="w-fit">
                            {getStatusBadge(refund.status)}
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] rounded-none">
                            {[
                              "pending",
                              "processing",
                              "completed",
                              "failed",
                              "rejected",
                            ].map((status) => (
                              <DropdownMenuItem
                                key={status}
                                onClick={() =>
                                  handleStatusChange(refund._id, status)
                                }
                                className="flex items-center justify-between"
                              >
                                {status.charAt(0).toUpperCase() +
                                  status.slice(1)}
                                {refund.status === status && (
                                  <Check className="h-4 w-4 text-primary" />
                                )}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                      <td className="p-6">
                        <div className="text-sm text-muted-foreground">
                          {formatDate(refund.createdAt)}
                        </div>
                      </td>
                      <td className="p-6">
                        <Link
                          to={`/admin/orders/order_details/${refund.orderId?._id}`}
                          className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                        >
                          <button
                            className="p-2 border border-border hover:bg-muted transition-colors group"
                            title="Process Refund"
                          >
                            <Eye className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                          </button>
                        </Link>
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
                  key={refund._id}
                  className="p-6 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="font-mono text-sm font-medium mb-1">
                        #{refund._id.slice(-8).toUpperCase()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(refund.createdAt)}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="w-fit">
                        {getStatusBadge(refund.status)}
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-48 mr-10 rounded-none">
                        {[
                          "pending",
                          "processing",
                          "completed",
                          "failed",
                          "rejected",
                        ].map((status) => (
                          <DropdownMenuItem
                            key={status}
                            onClick={() =>
                              handleStatusChange(refund._id, status)
                            }
                            className="flex items-center justify-between"
                          >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                            {refund.status === status && (
                              <Check className="h-4 w-4 text-primary" />
                            )}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">
                        Order ID
                      </div>
                      <div className="font-mono text-sm text-primary">
                        #{refund.orderId?._id.slice(-8).toUpperCase()}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-muted-foreground mb-1">
                        Customer
                      </div>
                      <div className="text-sm font-medium">
                        {refund.orderId?.shippingAddress.firstName}{" "}
                        {refund.orderId?.shippingAddress.lastName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {refund.customerEmail}
                      </div>
                    </div>

                    {refund.failureReason && (
                      <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded">
                        <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <div className="text-xs text-red-800">
                          {refund.failureReason}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <span className="text-sm font-medium">
                        {formatCurrency(refund.amount, refund.currency)}
                      </span>
                      <Link
                        to={`/admin/orders/order_details/${refund.orderId?._id}`}
                        className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                      >
                        <button
                          className="p-2 border border-border hover:bg-muted transition-colors group"
                          title="Process Refund"
                        >
                          <Eye className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                        </button>
                      </Link>
                    </div>
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
    </div>
  );
};

export default AdminRefunds;
