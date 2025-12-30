import { useState, useEffect } from "react";
import { Package, Search } from "lucide-react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import axiosInstance from "@/lib/axiosConfig";

// Types
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
}

const AdminDeliveredOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  // const [statusFilter, setStatusFilter] = useState("All");

  const fetchData = async (page: number) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/orders/admin/pagination-delivered-orders?page=${page}`
      );
      if (response.status === 200) {
        setOrders(response.data.orders);
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

    setFilteredOrders(filtered);
  }, [searchQuery, orders]);

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
      Delivered: "bg-green-100 text-green-800 border-green-200",
    };

    return (
      <span
        className={`inline-flex items-center justify-center gap-3 w-24 lg:w-30 h-10 text-xs font-medium border ${
          styles[status as keyof typeof styles] ||
          "bg-muted text-muted-foreground"
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="flex-1 space-y-4 p-4 bg-background">
      {/* HEADER */}
      <div className="mb-5 border-b border-border pb-8">
        <h1 className="text-2xl lg:text-5xl font-light tracking-tight mb-3">
          Delivered Orders
        </h1>
        <p className="text-sm text-muted-foreground">
          Overview of all delivered orders
        </p>
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
              className="w-full pl-10 pr-4 py-2.5 bg-background border border-input text-sm focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-card border border-border">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="flex items-center justify-center py-24">
              <Spinner className="size-6" />
            </div>
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
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order, index) => (
                    <tr
                      key={order._id}
                      className={`border-b border-border hover:bg-muted/50 transition-colors cursor-pointer ${
                        index === filteredOrders.length - 1 ? "border-b-0" : ""
                      }`}
                    >
                      <td className="p-6">
                        <div className="font-mono text-sm">
                          #{order._id.slice(-8).toUpperCase()}
                        </div>
                      </td>
                      <td className="p-6">
                        <div>
                          <div className="text-sm font-medium">
                            {order.shippingAddress.firstName}{" "}
                            {order.shippingAddress.lastName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {order.email}
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-2">
                          <div className="text-sm">
                            {order.orderedItems.reduce(
                              (sum, item) => sum + item.qty,
                              0
                            )}{" "}
                            items
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="text-sm font-medium">
                          {formatCurrency(order.totalPrice, order.currency)}
                        </div>
                      </td>
                      <td className="p-6">{getStatusBadge(order.status)}</td>
                      <td className="p-6">
                        <div className="text-sm text-muted-foreground">
                          {formatDate(order.createdAt)}
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
                    {getStatusBadge(order.status)}
                  </div>

                  <div className="space-y-2">
                    <div>
                      <div className="text-sm font-medium">
                        {order.shippingAddress.firstName}{" "}
                        {order.shippingAddress.lastName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {order.email}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <span className="text-sm text-muted-foreground">
                        {order.orderedItems.reduce(
                          (sum, item) => sum + item.qty,
                          0
                        )}{" "}
                        items
                      </span>
                      <span className="text-sm font-medium">
                        {formatCurrency(order.totalPrice, order.currency)}
                      </span>
                    </div>
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
    </div>
  );
};

export default AdminDeliveredOrders;
