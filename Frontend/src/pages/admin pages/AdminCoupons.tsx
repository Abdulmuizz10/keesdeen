import { useState, useEffect } from "react";
import {
  Tag,
  Percent,
  DollarSign,
  TrendingUp,
  Search,
  Filter,
  Check,
  Pencil,
  Trash2,
  Eye,
  Plus,
} from "lucide-react";
import Axios from "axios";
import { URL } from "@/lib/constants";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Coupon {
  _id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minPurchaseAmount: number;
  maxDiscountAmount: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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
          status === "active"
            ? "bg-green-100"
            : status === "percentage"
            ? "bg-blue-100"
            : status === "fixed"
            ? "bg-purple-100"
            : "bg-muted"
        }`}
      >
        <Icon
          className={`h-5 w-5 ${
            status === "active"
              ? "text-green-600"
              : status === "percentage"
              ? "text-blue-600"
              : status === "fixed"
              ? "text-purple-600"
              : "text-muted-foreground"
          }`}
        />
      </div>
    </div>
  </div>
);

const AdminCoupons: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [filteredCoupons, setFilteredCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Form state
  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage" as "percentage" | "fixed",
    discountValue: "",
    minPurchaseAmount: "",
    maxDiscountAmount: "",
    startDate: "",
    endDate: "",
    usageLimit: "",
    isActive: true,
  });

  // Dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [editForm, setEditForm] = useState<any>({});

  // Stats calculation
  const stats = {
    total: coupons?.length || 0,
    active: coupons?.filter((c) => c.isActive).length || 0,
    percentage:
      coupons?.filter((c) => c.discountType === "percentage").length || 0,
    fixed: coupons?.filter((c) => c.discountType === "fixed").length || 0,
  };

  const fetchCoupons = async (page: number) => {
    setLoading(true);
    try {
      const response = await Axios.get(
        `${URL}/coupons/admin/pagination-coupons?page=${page}`,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        setCoupons(response.data.coupons);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      toast.error("Failed to fetch coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons(currentPage);
  }, [currentPage]);

  // Filter coupons
  useEffect(() => {
    let filtered = [...coupons];

    if (searchQuery) {
      filtered = filtered.filter((coupon) =>
        coupon.code.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (typeFilter !== "All") {
      filtered = filtered.filter(
        (coupon) => coupon.discountType === typeFilter.toLowerCase()
      );
    }

    if (statusFilter !== "All") {
      if (statusFilter === "Active") {
        filtered = filtered.filter((coupon) => coupon.isActive);
      } else if (statusFilter === "Inactive") {
        filtered = filtered.filter((coupon) => !coupon.isActive);
      }
    }

    setFilteredCoupons(filtered);
  }, [searchQuery, typeFilter, statusFilter, coupons]);

  // Handle create coupon
  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await Axios.post(
        `${URL}/coupons/create-coupon`,
        {
          code: formData.code.toUpperCase(),
          discountType: formData.discountType,
          discountValue: parseFloat(formData.discountValue),
          minPurchaseAmount: parseFloat(formData.minPurchaseAmount),
          maxDiscountAmount: parseFloat(formData.maxDiscountAmount),
          startDate: formData.startDate,
          endDate: formData.endDate,
          usageLimit: parseInt(formData.usageLimit),
          isActive: formData.isActive,
        },
        { withCredentials: true }
      );

      if (response.status === 201) {
        toast.success("Coupon created successfully");
        setFormData({
          code: "",
          discountType: "percentage",
          discountValue: "",
          minPurchaseAmount: "",
          maxDiscountAmount: "",
          startDate: "",
          endDate: "",
          usageLimit: "",
          isActive: true,
        });
        fetchCoupons(currentPage);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create coupon");
    } finally {
      setLoading(false);
    }
  };

  // Handle edit
  const handleEditClick = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setEditForm({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue.toString(),
      minPurchaseAmount: coupon.minPurchaseAmount.toString(),
      maxDiscountAmount: coupon.maxDiscountAmount.toString(),
      startDate: coupon.startDate.split("T")[0],
      endDate: coupon.endDate.split("T")[0],
      usageLimit: coupon.usageLimit.toString(),
      isActive: coupon.isActive,
    });
    setEditDialogOpen(true);
  };

  const handleUpdateCoupon = async () => {
    if (!selectedCoupon) return;
    setLoading(true);

    try {
      const response = await Axios.put(
        `${URL}/coupons/admin/${selectedCoupon._id}/update-coupon`,
        {
          code: editForm.code.toUpperCase(),
          discountType: editForm.discountType,
          discountValue: parseFloat(editForm.discountValue),
          minPurchaseAmount: parseFloat(editForm.minPurchaseAmount),
          maxDiscountAmount: parseFloat(editForm.maxDiscountAmount),
          startDate: editForm.startDate,
          endDate: editForm.endDate,
          usageLimit: parseInt(editForm.usageLimit),
          isActive: editForm.isActive,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast.success("Coupon updated successfully");
        setEditDialogOpen(false);
        fetchCoupons(currentPage);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update coupon");
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDeleteClick = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setDeleteDialogOpen(true);
  };

  const handleDeleteCoupon = async () => {
    if (!selectedCoupon) return;
    setLoading(true);

    try {
      const response = await Axios.delete(
        `${URL}/coupons/admin/${selectedCoupon._id}/delete-coupon`,
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast.success("Coupon deleted successfully");
        setDeleteDialogOpen(false);
        fetchCoupons(currentPage);
      }
    } catch (error) {
      toast.error("Failed to delete coupon");
    } finally {
      setLoading(false);
    }
  };

  // Handle view
  const handleViewClick = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setViewDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(amount);
  };

  return (
    <div className="flex-1 space-y-5 p-4 bg-background">
      {/* HEADER */}
      <div className="mb-5 border-b border-border pb-8">
        <h1 className="text-2xl lg:text-5xl font-light tracking-tight mb-3">
          Coupons Management
        </h1>
        <p className="text-sm text-muted-foreground">
          Create and manage discount coupons for your store
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Coupons" value={stats.total} icon={Tag} />
        <StatCard
          title="Active"
          value={stats.active}
          icon={TrendingUp}
          status="active"
        />
        <StatCard
          title="Percentage"
          value={stats.percentage}
          icon={Percent}
          status="percentage"
        />
        <StatCard
          title="Fixed"
          value={stats.fixed}
          icon={DollarSign}
          status="fixed"
        />
      </div>

      {/* CREATE COUPON FORM */}
      <section className="bg-card border border-border p-8">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
          <Plus className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-light tracking-tight">
            Create New Coupon
          </h2>
        </div>

        <form
          onSubmit={handleCreateCoupon}
          className="space-y-6 flex flex-col items-end"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Coupon Code */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Coupon Code</label>
              <input
                type="text"
                placeholder="SUMMER2024"
                value={formData.code}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    code: e.target.value.toUpperCase(),
                  })
                }
                className="w-full px-4 py-3 bg-background border border-input focus:outline-none focus:border-foreground transition-colors uppercase"
                required
              />
            </div>

            {/* Discount Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Discount Type</label>
              <select
                value={formData.discountType}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    discountType: e.target.value as "percentage" | "fixed",
                  })
                }
                className="w-full px-4 py-3 bg-background border border-input focus:outline-none focus:border-foreground transition-colors"
                required
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (£)</option>
              </select>
            </div>

            {/* Discount Value */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Discount Value</label>
              <input
                type="number"
                placeholder={
                  formData.discountType === "percentage" ? "20" : "10.00"
                }
                value={formData.discountValue}
                onChange={(e) =>
                  setFormData({ ...formData, discountValue: e.target.value })
                }
                className="w-full px-4 py-3 bg-background border border-input focus:outline-none focus:border-foreground transition-colors"
                step="0.01"
                min="0"
                required
              />
            </div>

            {/* Min Purchase */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Min Purchase Amount (£)
              </label>
              <input
                type="number"
                placeholder="50.00"
                value={formData.minPurchaseAmount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    minPurchaseAmount: e.target.value,
                  })
                }
                className="w-full px-4 py-3 bg-background border border-input focus:outline-none focus:border-foreground transition-colors"
                step="0.01"
                min="0"
                required
              />
            </div>

            {/* Max Discount */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Max Discount Amount (£)
              </label>
              <input
                type="number"
                placeholder="100.00"
                value={formData.maxDiscountAmount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxDiscountAmount: e.target.value,
                  })
                }
                className="w-full px-4 py-3 bg-background border border-input focus:outline-none focus:border-foreground transition-colors"
                step="0.01"
                min="0"
                required
              />
            </div>

            {/* Usage Limit */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Usage Limit</label>
              <input
                type="number"
                placeholder="100"
                value={formData.usageLimit}
                onChange={(e) =>
                  setFormData({ ...formData, usageLimit: e.target.value })
                }
                className="w-full px-4 py-3 bg-background border border-input focus:outline-none focus:border-foreground transition-colors"
                min="1"
                required
              />
            </div>

            {/* Start Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                className="w-full px-4 py-3 bg-background border border-input focus:outline-none focus:border-foreground transition-colors"
                required
              />
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium">End Date</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                className="w-full px-4 py-3 bg-background border border-input focus:outline-none focus:border-foreground transition-colors"
                required
              />
            </div>

            {/* Is Active */}
            <div className="space-y-2 flex items-end">
              <label className="flex items-center gap-3 cursor-pointer px-4 py-3.5 w-full border border-border hover:bg-muted/50 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium">Active</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-fit px-8 py-3 bg-foreground text-background hover:bg-foreground/90 transition-colors disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Coupon"}
          </button>
        </form>
      </section>

      {/* ALL COUPONS SECTION */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <Tag className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-light tracking-tight">All Coupons</h2>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by coupon code..."
                className="w-full pl-10 pr-4 py-2.5 bg-background border border-input text-sm focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="relative">
              <DropdownMenu>
                <DropdownMenuTrigger className="w-full">
                  <div className="relative flex items-center gap-2 pl-10 pr-8 py-2.5 bg-background border border-input text-sm cursor-pointer min-w-[150px]">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <span>{typeFilter}</span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 ml-4 rounded-none">
                  {["All", "Percentage", "Fixed"].map((type) => (
                    <DropdownMenuItem
                      key={type}
                      onClick={() => setTypeFilter(type)}
                      className="flex items-center justify-between"
                    >
                      {type}
                      {typeFilter === type && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="relative">
              <DropdownMenu>
                <DropdownMenuTrigger className="w-full">
                  <div className="relative flex items-center gap-2 pl-10 pr-8 py-2.5 bg-background border border-input text-sm cursor-pointer min-w-[150px]">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <span>{statusFilter}</span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 ml-4 rounded-none">
                  {["All", "Active", "Inactive"].map((status) => (
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

        {/* Table */}
        <div className="bg-card border border-border">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Spinner className="size-6" />
            </div>
          ) : !filteredCoupons || filteredCoupons.length === 0 ? (
            <div className="text-center py-24">
              <Tag className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg text-muted-foreground">No coupons found</p>
            </div>
          ) : (
            <>
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border">
                    <tr>
                      <th className="text-left p-6 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                        Code
                      </th>
                      <th className="text-left p-6 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                        Type
                      </th>
                      <th className="text-left p-6 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                        Value
                      </th>
                      <th className="text-left p-6 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                        Min Purchase
                      </th>
                      <th className="text-left p-6 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                        Usage
                      </th>
                      <th className="text-left p-6 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                        Valid Until
                      </th>
                      <th className="text-left p-6 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                        Status
                      </th>
                      <th className="text-left p-6 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCoupons.map((coupon, index) => (
                      <tr
                        key={coupon._id}
                        className={`border-b border-border hover:bg-muted/50 transition-colors ${
                          index === filteredCoupons.length - 1
                            ? "border-b-0"
                            : ""
                        }`}
                      >
                        <td className="p-6">
                          <span className="font-mono text-sm font-medium">
                            {coupon.code}
                          </span>
                        </td>
                        <td className="p-6">
                          <span
                            className={`inline-flex items-center text-xs font-medium ${
                              coupon.discountType === "percentage"
                                ? "text-blue-700"
                                : "text-purple-700"
                            }`}
                          >
                            {coupon.discountType === "percentage"
                              ? "Percentage"
                              : "Fixed"}
                          </span>
                        </td>
                        <td className="p-6">
                          <span className="text-sm font-medium">
                            {coupon.discountType === "percentage"
                              ? `${coupon.discountValue}%`
                              : formatCurrency(coupon.discountValue)}
                          </span>
                        </td>
                        <td className="p-6">
                          <span className="text-sm">
                            {formatCurrency(coupon.minPurchaseAmount)}
                          </span>
                        </td>
                        <td className="p-6">
                          <span className="text-sm">
                            {coupon.usedCount} / {coupon.usageLimit}
                          </span>
                        </td>
                        <td className="p-6">
                          <span className="text-sm text-muted-foreground">
                            {formatDate(coupon.endDate)}
                          </span>
                        </td>
                        <td className="p-6">
                          <span
                            className={`inline-flex items-center text-xs font-medium ${
                              coupon.isActive
                                ? "text-green-300"
                                : "text-red-300"
                            }`}
                          >
                            {coupon.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="p-6">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditClick(coupon)}
                              className="p-2 hover:bg-muted rounded transition-colors"
                              title="Edit coupon"
                            >
                              <Pencil className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(coupon)}
                              className="p-2 hover:bg-muted rounded transition-colors"
                              title="Delete coupon"
                            >
                              <Trash2 className="h-4 w-4 text-muted-foreground hover:text-red-600" />
                            </button>
                            <button
                              onClick={() => handleViewClick(coupon)}
                              className="p-2 hover:bg-muted rounded transition-colors"
                              title="View details"
                            >
                              <Eye className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden divide-y divide-border">
                {filteredCoupons.map((coupon) => (
                  <div
                    key={coupon._id}
                    className="p-6 hover:bg-muted/50 transition-colors space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-mono text-sm font-medium mb-1">
                          {coupon.code}
                        </p>
                        <span
                          className={`inline-flex items-center text-xs font-medium ${
                            coupon.discountType === "percentage"
                              ? "text-blue-700"
                              : "text-purple-700"
                          }`}
                        >
                          {coupon.discountType === "percentage"
                            ? `${coupon.discountValue}%`
                            : formatCurrency(coupon.discountValue)}
                        </span>
                      </div>
                      <span
                        className={`inline-flex items-center text-xs font-medium ${
                          coupon.isActive ? "text-green-300" : "text-red-300"
                        }`}
                      >
                        {coupon.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Min Purchase:
                        </span>
                        <span>{formatCurrency(coupon.minPurchaseAmount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Usage:</span>
                        <span>
                          {coupon.usedCount} / {coupon.usageLimit}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Valid Until:
                        </span>
                        <span>{formatDate(coupon.endDate)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-border">
                      <button
                        onClick={() => handleEditClick(coupon)}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm bg-background border border-border hover:bg-muted transition-colors"
                      >
                        <Pencil className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(coupon)}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm bg-background border text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                      <button
                        onClick={() => handleViewClick(coupon)}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm bg-foreground text-background hover:bg-foreground/90 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Pagination */}
          {!loading && filteredCoupons && filteredCoupons.length > 0 && (
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
      </section>

      {/* EDIT DIALOG */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] text-foreground max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground text-xl font-light tracking-tight">
              Edit Coupon
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Update coupon details for {selectedCoupon?.code}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Coupon Code</label>
                <input
                  type="text"
                  value={editForm.code}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      code: e.target.value.toUpperCase(),
                    })
                  }
                  className="w-full px-4 py-3 bg-background border border-input focus:outline-none focus:border-foreground transition-colors uppercase"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Discount Type</label>
                <select
                  value={editForm.discountType}
                  onChange={(e) =>
                    setEditForm({ ...editForm, discountType: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-background border border-input focus:outline-none focus:border-foreground transition-colors"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (£)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Discount Value</label>
                <input
                  type="number"
                  value={editForm.discountValue}
                  onChange={(e) =>
                    setEditForm({ ...editForm, discountValue: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-background border border-input focus:outline-none focus:border-foreground transition-colors"
                  step="0.01"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Min Purchase (£)</label>
                <input
                  type="number"
                  value={editForm.minPurchaseAmount}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      minPurchaseAmount: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-background border border-input focus:outline-none focus:border-foreground transition-colors"
                  step="0.01"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Max Discount (£)</label>
                <input
                  type="number"
                  value={editForm.maxDiscountAmount}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      maxDiscountAmount: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-background border border-input focus:outline-none focus:border-foreground transition-colors"
                  step="0.01"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Usage Limit</label>
                <input
                  type="number"
                  value={editForm.usageLimit}
                  onChange={(e) =>
                    setEditForm({ ...editForm, usageLimit: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-background border border-input focus:outline-none focus:border-foreground transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Date</label>
                <input
                  type="date"
                  value={editForm.startDate}
                  onChange={(e) =>
                    setEditForm({ ...editForm, startDate: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-background border border-input focus:outline-none focus:border-foreground transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">End Date</label>
                <input
                  type="date"
                  value={editForm.endDate}
                  onChange={(e) =>
                    setEditForm({ ...editForm, endDate: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-background border border-input focus:outline-none focus:border-foreground transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editForm.isActive}
                  onChange={(e) =>
                    setEditForm({ ...editForm, isActive: e.target.checked })
                  }
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium">Active</span>
              </label>
            </div>
          </div>

          <DialogFooter>
            <button
              type="button"
              onClick={() => setEditDialogOpen(false)}
              className="px-4 py-2 text-sm border border-border text-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleUpdateCoupon}
              className="px-4 py-2 text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Update Coupon
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE DIALOG */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px] text-foreground">
          <DialogHeader>
            <DialogTitle className="text-foreground text-xl font-light tracking-tight">
              Delete Coupon
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Are you sure you want to delete the coupon "{selectedCoupon?.code}
              "? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <button
              type="button"
              onClick={() => setDeleteDialogOpen(false)}
              className="px-4 py-2 text-sm border border-border text-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteCoupon}
              className="px-4 py-2 text-sm bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              Delete Coupon
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* VIEW DETAILS DIALOG */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px] text-foreground">
          <DialogHeader>
            <DialogTitle className="text-foreground text-xl font-light tracking-tight">
              Coupon Details
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Complete information for {selectedCoupon?.code}
            </DialogDescription>
          </DialogHeader>

          {selectedCoupon && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Code</p>
                  <p className="font-mono font-medium">{selectedCoupon.code}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Type</p>
                  <span
                    className={`inline-flex items-center text-xs font-medium ${
                      selectedCoupon.discountType === "percentage"
                        ? "text-blue-700"
                        : "text-purple-700"
                    }`}
                  >
                    {selectedCoupon.discountType === "percentage"
                      ? "Percentage"
                      : "Fixed"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Discount Value</p>
                  <p className="font-medium">
                    {selectedCoupon.discountType === "percentage"
                      ? `${selectedCoupon.discountValue}%`
                      : formatCurrency(selectedCoupon.discountValue)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Min Purchase</p>
                  <p className="font-medium">
                    {formatCurrency(selectedCoupon.minPurchaseAmount)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Max Discount</p>
                  <p className="font-medium">
                    {formatCurrency(selectedCoupon.maxDiscountAmount)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Usage</p>
                  <p className="font-medium">
                    {selectedCoupon.usedCount} / {selectedCoupon.usageLimit}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Start Date</p>
                  <p className="font-medium">
                    {formatDate(selectedCoupon.startDate)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">End Date</p>
                  <p className="font-medium">
                    {formatDate(selectedCoupon.endDate)}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-muted-foreground mb-2 text-sm">Status</p>
                <span
                  className={`inline-flex items-center text-xs font-medium ${
                    selectedCoupon.isActive ? "text-green-300" : "text-red-300"
                  }`}
                >
                  {selectedCoupon.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          )}

          <DialogFooter>
            <button
              type="button"
              onClick={() => setViewDialogOpen(false)}
              className="px-4 py-2 text-sm bg-foreground text-background hover:bg-foreground/90 transition-colors"
            >
              Close
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCoupons;
