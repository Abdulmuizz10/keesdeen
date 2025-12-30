import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Calendar,
  Shield,
  User,
  Package,
  Key,
  Globe,
  ShoppingBag,
  TrendingUp,
  DollarSign,
  ArrowUpDown,
  ChevronDown,
  Pencil,
} from "lucide-react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import axiosInstance from "@/lib/axiosConfig";

// Types
interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  isAdmin: boolean;
  authMethod: "password" | "google";
  createdAt: string;
  updatedAt: string;
}

interface OrderItem {
  name: string;
  qty: number;
  image: string;
  price: number;
  size: string;
  color: string;
  product: string;
  _id: string;
}

interface Order {
  _id: string;
  email: string;
  currency: string;
  coupon: string;
  orderedItems: OrderItem[];
  totalPrice: number;
  status: string;
  createdAt: string;
  paidAt: string;
}

type SortOption = "recent" | "oldest" | "highest" | "lowest";

const AdminUserDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    isAdmin: false,
  });

  const fetchUserDetails = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/users/admin/find-user/${id}`);
      if (response.status === 200) {
        setUser(response.data.user);
        setOrders(response.data.orders || []);
      }
    } catch (error) {
      toast.error("Failed to fetch user details");
      navigate("/admin/customers");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    if (!user) return;
    setEditForm({ isAdmin: user.isAdmin });
    setRoleDialogOpen(true);
  };

  const handleUpdateRole = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await axiosInstance.patch(
        `/users/admin/${user._id}/role`,
        { isAdmin: editForm.isAdmin },
        {
          validateStatus: (status: any) => status < 600,
        }
      );

      if (response.status === 200) {
        setUser({ ...user, isAdmin: editForm.isAdmin });
        toast.success(
          response.data.message || "User role updated successfully"
        );
        setRoleDialogOpen(false);
      } else {
        toast.error(response.data.message || "Failed to update user role");
      }
    } catch (error) {
      toast.error("Failed to update user role");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchUserDetails();
    }
  }, [id]);

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
      Shipped: "bg-purple-50 text-purple-700 border-purple-200",
      Delivered: "bg-green-50 text-green-700 border-green-200",
      Cancelled: "bg-red-50 text-red-700 border-red-200",
    };
    return (
      colors[status as keyof typeof colors] ||
      "bg-muted text-muted-foreground border-border"
    );
  };

  const getSortedOrders = () => {
    const sorted = [...orders];
    switch (sortBy) {
      case "recent":
        return sorted.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "oldest":
        return sorted.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "highest":
        return sorted.sort((a, b) => b.totalPrice - a.totalPrice);
      case "lowest":
        return sorted.sort((a, b) => a.totalPrice - b.totalPrice);
      default:
        return sorted;
    }
  };

  const getSortLabel = () => {
    switch (sortBy) {
      case "recent":
        return "Recent Orders";
      case "oldest":
        return "Oldest Orders";
      case "highest":
        return "Most Expensive";
      case "lowest":
        return "Least Expensive";
      default:
        return "Sort By";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">User not found</p>
      </div>
    );
  }

  // Calculate user statistics
  const totalSpent = orders.reduce((sum, order) => sum + order.totalPrice, 0);
  const totalOrders = orders.length;
  const completedOrders = orders.filter((o) => o.status === "Delivered").length;
  const averageOrder = totalOrders > 0 ? totalSpent / totalOrders : 0;

  const sortedOrders = getSortedOrders();

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="">
        {/* Header */}
        <div className="mb-5 border-b border-border pb-8">
          <button
            onClick={() => navigate("/admin/customers")}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Users
          </button>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                <span className="text-2xl font-medium">
                  {user.firstName.charAt(0).toUpperCase()}
                  {user.lastName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-3xl lg:text-5xl font-light tracking-tight mb-2">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-sm text-muted-foreground font-mono">
                  ID: {user._id.slice(-12).toUpperCase()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-6 border border-border bg-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-full bg-green-100">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-sm text-muted-foreground">Total Spent</p>
            </div>
            <p className="text-2xl font-light tracking-tight">
              {formatCurrency(totalSpent)}
            </p>
          </div>

          <div className="p-6 border border-border bg-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-full bg-blue-100">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-sm text-muted-foreground">Total Orders</p>
            </div>
            <p className="text-2xl font-light tracking-tight">{totalOrders}</p>
          </div>

          <div className="p-6 border border-border bg-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-full bg-purple-100">
                <ShoppingBag className="h-5 w-5 text-purple-600" />
              </div>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
            <p className="text-2xl font-light tracking-tight">
              {completedOrders}
            </p>
          </div>

          <div className="p-6 border border-border bg-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-full bg-orange-100">
                <DollarSign className="h-5 w-5 text-orange-600" />
              </div>
              <p className="text-sm text-muted-foreground">Average Order</p>
            </div>
            <p className="text-2xl font-light tracking-tight">
              {formatCurrency(averageOrder)}
            </p>
          </div>
        </section>

        {/* User Information */}
        <section className="mb-8 bg-card">
          <h2 className="text-xl font-light tracking-tight mb-6">
            User Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">
                  Email Address
                </p>
                <p className="text-sm break-all">{user.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">Role</p>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex text-xs font-medium ${
                      user.isAdmin ? "text-green-300" : "text-muted-foreground"
                    }`}
                  >
                    {user.isAdmin ? "Administrator" : "Customer"}
                  </span>
                  <button
                    onClick={handleEditClick}
                    className="p-2 hover:bg-muted rounded transition-colors"
                    title="Update role"
                  >
                    <Pencil className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              {user.authMethod === "google" ? (
                <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
              ) : (
                <Key className="h-5 w-5 text-muted-foreground mt-0.5" />
              )}
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">
                  Authentication Method
                </p>
                <span
                  className={`inline-flex gap-1.5 text-xs font-medium ${
                    user.authMethod === "google"
                      ? "text-blue-300"
                      : "text-green-300"
                  } `}
                >
                  {user.authMethod === "google" ? (
                    <>
                      <Globe className="h-3 w-3" />
                      Google
                    </>
                  ) : (
                    <>
                      <Key className="h-3 w-3" />
                      Password
                    </>
                  )}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">
                  Member Since
                </p>
                <p className="text-sm">{formatDate(user.createdAt)}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">
                  Last Updated
                </p>
                <p className="text-sm">{formatDate(user.updatedAt)}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Order History */}
        <section className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-xl font-light tracking-tight">
                Order History
              </h2>
              <span className="text-sm text-muted-foreground">
                ({orders.length})
              </span>
            </div>

            {orders.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-border hover:bg-muted transition-colors">
                    <ArrowUpDown className="h-4 w-4" />
                    {getSortLabel()}
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="min-w-[--radix-dropdown-menu-trigger-width] rounded-none">
                  <DropdownMenuItem onClick={() => setSortBy("recent")}>
                    Recent Orders
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("oldest")}>
                    Oldest Orders
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSortBy("highest")}>
                    Most Expensive
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("lowest")}>
                    Least Expensive
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12 border border-border">
              <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No orders yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedOrders.map((order) => (
                <Link
                  key={order._id}
                  to={`/admin/orders/order_details/${order._id}`}
                  className="block"
                >
                  <div className="p-6 border border-border hover:bg-muted/30 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="font-mono text-sm font-medium mb-1">
                          #{order._id.slice(-8).toUpperCase()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-2 text-xs font-medium border ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      {order.orderedItems.slice(0, 3).map((item, idx) => (
                        <img
                          key={idx}
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover border border-border"
                        />
                      ))}
                      {order.orderedItems.length > 3 && (
                        <div className="w-16 h-16 border border-border flex items-center justify-center bg-muted">
                          <span className="text-xs text-muted-foreground">
                            +{order.orderedItems.length - 3}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
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
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Role Edit Dialog */}
      <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
        <DialogContent className="sm:max-w-[425px] text-foreground">
          <DialogHeader>
            <DialogTitle className="text-foreground text-xl font-light tracking-tight">
              Update User Role
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Update role for {user?.firstName} {user?.lastName}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4 text-foreground">
            <div className="flex items-center justify-between">
              <div>
                <Label
                  htmlFor="isAdmin"
                  className="text-sm font-medium text-foreground"
                >
                  Administrator Access
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Grant full admin panel access
                </p>
              </div>
              <Switch
                id="isAdmin"
                checked={editForm.isAdmin}
                onCheckedChange={(checked) =>
                  setEditForm({ ...editForm, isAdmin: checked })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <button
              type="button"
              onClick={() => setRoleDialogOpen(false)}
              className="px-4 py-2 text-sm border border-border text-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleUpdateRole}
              className="px-4 py-2 text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Update User
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUserDetails;
