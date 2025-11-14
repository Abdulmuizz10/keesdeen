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
} from "lucide-react";
import Axios from "axios";
import { URL } from "@/lib/constants";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

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
  isDelivered: string;
  createdAt: string;
}

// Mock data for demo

// const mockOrders: Order[] = [
//   {
//     _id: "69034a057bbaa179349031d8",
//     email: "harrismuizz10@gmail.com",
//     currency: "GBP",
//     orderedItems: [
//       {
//         name: "Product 1",
//         qty: 1,
//         image:
//           "https://res.cloudinary.com/dx2alxgiq/image/upload/v1760828800/product_images/tz8vxvplhvk6kgtcjxdk.png",
//         price: 10,
//         size: "S",
//         color: "Gray",
//         _id: "69034a057bbaa179349031d9",
//       },
//       {
//         name: "Product 1",
//         qty: 2,
//         image:
//           "https://res.cloudinary.com/dx2alxgiq/image/upload/v1760828800/product_images/tz8vxvplhvk6kgtcjxdk.png",
//         price: 10,
//         size: "L",
//         color: "Blue",
//         _id: "69034a057bbaa179349031da",
//       },
//     ],
//     shippingAddress: {
//       firstName: "Abdul Muizz",
//       lastName: "Abdulrahaman",
//       email: "harrismuizz10@gmail.com",
//       country: "NG",
//       state: "FC",
//       address1: "NO 21 A",
//       address2: "",
//       phone: "2348067028516",
//       postalCode: "111111",
//     },
//     totalPrice: 30,
//     paidAt: "2025-10-30T11:20:35.041Z",
//     isDelivered: "Pending",
//     createdAt: "2025-10-30T11:20:37.269Z",
//   },
//   {
//     _id: "69034a057bbaa179349031d9",
//     email: "customer2@example.com",
//     currency: "GBP",
//     orderedItems: [
//       {
//         name: "Product 2",
//         qty: 3,
//         image:
//           "https://res.cloudinary.com/dx2alxgiq/image/upload/v1760828800/product_images/tz8vxvplhvk6kgtcjxdk.png",
//         price: 25,
//         size: "M",
//         color: "Black",
//         _id: "69034a057bbaa179349031db",
//       },
//     ],
//     shippingAddress: {
//       firstName: "John",
//       lastName: "Doe",
//       email: "customer2@example.com",
//       country: "UK",
//       state: "London",
//       address1: "123 High Street",
//       address2: "",
//       phone: "447123456789",
//       postalCode: "SW1A 1AA",
//     },
//     totalPrice: 75,
//     paidAt: "2025-10-29T14:30:00.000Z",
//     isDelivered: "Delivered",
//     createdAt: "2025-10-29T14:30:00.000Z",
//   },
// ];

// Stat Card Component

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

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Stats calculation
  const stats = {
    total: orders?.length || 0,
    pending: orders?.filter((o) => o.isDelivered === "Pending").length || 0,
    delivered: orders?.filter((o) => o.isDelivered === "Delivered").length || 0,
    cancelled: orders?.filter((o) => o.isDelivered === "Cancelled").length || 0,
  };

  const fetchData = async (page: number) => {
    setLoading(true);
    try {
      const response = await Axios.get(
        `${URL}/orders/admin/pagination-orders?page=${page}`,
        {
          withCredentials: true,
        }
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

  const handleStatusChange = async (orderId: any, status: string) => {
    setLoading(true);
    try {
      const response = await Axios.patch(
        `${URL}/orders/admin/order/${orderId}/status`,
        { status },
        {
          withCredentials: true,
          validateStatus: (status: any) => status < 600,
        }
      );
      if (response.status === 200) {
        fetchData(currentPage);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Filter orders
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
      filtered = filtered.filter((order) => order.isDelivered === statusFilter);
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
      Delivered: "bg-green-100 text-green-800 border-green-200",
      Cancelled: "bg-red-100 text-red-800 border-red-200",
      Processing: "bg-blue-100 text-blue-800 border-blue-200",
    };

    return (
      <span
        className={`inline-flex items-center justify-center w-20 lg:w-24 h-10 text-xs font-medium border ${
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

          {/* Status Filter */}
          <div className="relative">
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full">
                <div className="relative flex items-center gap-2 pl-10 pr-8 py-2.5 bg-background border border-input text-sm cursor-pointer">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <span>{statusFilter}</span>
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-48 mr-10 rounded-none">
                {["All", "Pending", "Processing", "Delivered", "Cancelled"].map(
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
                      <td className="p-6">
                        {/* {getStatusBadge(order.isDelivered)} */}
                        <DropdownMenu>
                          <DropdownMenuTrigger className="w-fit">
                            {getStatusBadge(order.isDelivered)}
                          </DropdownMenuTrigger>

                          <DropdownMenuContent className="w-48 mr-24 rounded-none">
                            {[
                              "All",
                              "Pending",
                              "Processing",
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

                                {statusFilter === status && (
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
                        {getStatusBadge(order.isDelivered)}
                      </DropdownMenuTrigger>

                      <DropdownMenuContent className="w-48 mr-10 rounded-none">
                        {[
                          "All",
                          "Pending",
                          "Processing",
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

                            {statusFilter === status && (
                              <Check className="h-4 w-4 text-primary" />
                            )}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
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

export default AdminOrders;
