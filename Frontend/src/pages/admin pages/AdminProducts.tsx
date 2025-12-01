import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
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

import {
  Package,
  Star,
  Sparkles,
  Search,
  Filter,
  Check,
  Edit,
  Trash2,
  SquarePen,
  Pencil,
} from "lucide-react";
import Axios from "axios";
import { URL } from "@/lib/constants";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { Link } from "react-router-dom";

// Types
interface Product {
  _id: string;
  name: string;
  brand: string;
  category: string;
  subcategory: string;
  type: string;
  previousPrice: number;
  price: number;
  sizes: string[];
  colors: string[];
  newArrival: boolean;
  bestSeller: boolean;
  isAvailable: boolean;
  gender: string;
  imageUrls: string[];
  description: string;
  reviews: any[];
  createdAt: string;
  updatedAt: string;
}

const StatCard = ({ title, value, icon: Icon }: any) => (
  <div className="bg-card border border-border p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-3xl font-light tracking-tight mt-2">{value}</p>
      </div>
      <div className={`p-3 rounded-full bg-muted`}>
        <Icon className={`h-5 w-5 text-muted-foreground`} />
      </div>
    </div>
  </div>
);

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [availabilityFilter, setAvailabilityFilter] = useState("All");

  // Dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Edit form state
  const [editForm, setEditForm] = useState({
    bestSeller: false,
    newArrival: false,
    isAvailable: false,
  });

  // Stats calculation
  const stats = {
    total: products?.length || 0,
    bestSellers: products?.filter((p) => p.bestSeller).length || 0,
    newArrivals: products?.filter((p) => p.newArrival).length || 0,
    available: products?.filter((p) => p.isAvailable).length || 0,
  };

  const fetchData = async (page: number) => {
    setLoading(true);
    try {
      const response = await Axios.get(
        `${URL}/products/admin/pagination-products?page=${page}`,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        setProducts(response.data.products);
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

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setEditForm({
      bestSeller: product.bestSeller,
      newArrival: product.newArrival,
      isAvailable: product.isAvailable,
    });
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product);
    setDeleteDialogOpen(true);
  };

  const handleUpdateProduct = async () => {
    if (!selectedProduct) return;

    setLoading(true);
    try {
      // Update Best Seller
      if (editForm.bestSeller !== selectedProduct.bestSeller) {
        const bestSellerStatus = editForm.bestSeller
          ? "isBestSeller"
          : "notBestSeller";
        await Axios.patch(
          `${URL}/products/admin/update/${selectedProduct._id}/best-seller`,
          { status: bestSellerStatus },
          { withCredentials: true }
        );
      }

      // Update New Arrival
      if (editForm.newArrival !== selectedProduct.newArrival) {
        const newArrivalStatus = editForm.newArrival
          ? "isNewArrival"
          : "notNewArrival";
        await Axios.patch(
          `${URL}/products/admin/update/${selectedProduct._id}/new-arrival`,
          { status: newArrivalStatus },
          { withCredentials: true }
        );
      }

      // Update Availability
      if (editForm.isAvailable !== selectedProduct.isAvailable) {
        const availabilityStatus = editForm.isAvailable
          ? "isAvailable"
          : "notAvailable";
        await Axios.patch(
          `${URL}/products/admin/update/${selectedProduct._id}/availability`,
          { status: availabilityStatus },
          { withCredentials: true }
        );
      }

      toast.success("Product updated successfully");
      setEditDialogOpen(false);
      fetchData(currentPage);
    } catch (error) {
      toast.error("Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;
    setLoading(true);
    try {
      const response = await Axios.delete(
        `${URL}/products/admin/products/${selectedProduct._id}`,
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast.success("Product deleted successfully");
        setDeleteDialogOpen(false);
        fetchData(currentPage);
      }
    } catch (error) {
      toast.error("Failed to delete product");
    } finally {
      setLoading(false);
    }
  };

  // Filter products
  useEffect(() => {
    let filtered = [...products];

    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product._id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (categoryFilter !== "All") {
      filtered = filtered.filter(
        (product) => product.category === categoryFilter
      );
    }

    if (availabilityFilter !== "All") {
      if (availabilityFilter === "Available") {
        filtered = filtered.filter((product) => product.isAvailable);
      } else if (availabilityFilter === "Unavailable") {
        filtered = filtered.filter((product) => !product.isAvailable);
      }
    }

    setFilteredProducts(filtered);
  }, [searchQuery, categoryFilter, availabilityFilter, products]);

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

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  return (
    <div className="flex-1 space-y-4 p-4 bg-background">
      {/* HEADER */}
      <div className="mb-5 border-b border-border pb-8">
        <h1 className="text-2xl lg:text-5xl font-light tracking-tight mb-3">
          Products Management
        </h1>
        <p className="text-sm text-muted-foreground">
          View and manage all products in your inventory
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Products" value={stats.total} icon={Package} />
        <StatCard
          title="Best Sellers"
          value={stats.bestSellers}
          icon={Star}
          status="best_seller"
        />
        <StatCard
          title="New Arrivals"
          value={stats.newArrivals}
          icon={Sparkles}
          status="new_arrival"
        />
        <StatCard
          title="In Stock"
          value={stats.available}
          icon={Check}
          status="in_stock"
        />
      </div>

      {/* Filters */}
      <div className="bg-card border border-border p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by product name, brand, category, or ID..."
              className="w-full pl-10 pr-4 py-2.5 bg-background border border-input text-sm focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="relative">
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full">
                <div className="relative flex items-center gap-2 pl-10 pr-8 py-2.5 bg-background border border-input text-sm cursor-pointer min-w-[180px]">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <span>{categoryFilter}</span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 ml-4 rounded-none">
                {categories.map((category) => (
                  <DropdownMenuItem
                    key={category}
                    onClick={() => setCategoryFilter(category)}
                    className="flex items-center justify-between"
                  >
                    {category}
                    {categoryFilter === category && (
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
                <div className="relative flex items-center gap-2 pl-10 pr-8 py-2.5 bg-background border border-input text-sm cursor-pointer min-w-[180px]">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <span>{availabilityFilter}</span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 ml-4 rounded-none">
                {["All", "Available", "Unavailable"].map((status) => (
                  <DropdownMenuItem
                    key={status}
                    onClick={() => setAvailabilityFilter(status)}
                    className="flex items-center justify-between"
                  >
                    {status}
                    {availabilityFilter === status && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-card border border-border">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Spinner className="size-6" />
          </div>
        ) : !filteredProducts || filteredProducts.length === 0 ? (
          <div className="text-center py-24">
            <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground">No products found</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border">
                  <tr>
                    <th className="text-left p-6 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      Product
                    </th>
                    <th className="text-left p-6 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      Category
                    </th>
                    <th className="text-left p-6 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      Price
                    </th>
                    <th className="text-left p-6 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="text-left p-6 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      Best Seller
                    </th>
                    <th className="text-left p-6 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      New Arrival
                    </th>
                    <th className="text-left p-6 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      Date Added
                    </th>
                    <th className="text-left p-6 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product, index) => (
                    <tr
                      key={product._id}
                      className={`border-b border-border hover:bg-muted/50 transition-colors ${
                        index === filteredProducts.length - 1
                          ? "border-b-0"
                          : ""
                      }`}
                    >
                      <td className="p-6">
                        <div>
                          <Link
                            to={`/admin/products/product_details/${product._id}`}
                            className="flex items-center gap-4"
                          >
                            <img
                              src={product.imageUrls[0]}
                              alt={product.name}
                              className="w-12 h-12 object-cover border border-border"
                            />
                            <div>
                              <div className="text-sm font-medium">
                                {product.name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {product.brand}
                              </div>
                            </div>
                          </Link>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="text-sm">{product.category}</div>
                        <div className="text-xs text-muted-foreground">
                          {product.subcategory}
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="text-sm font-medium">
                          {formatCurrency(product.price)}
                        </div>
                        {product.previousPrice > product.price && (
                          <div className="text-xs text-muted-foreground line-through">
                            {formatCurrency(product.previousPrice)}
                          </div>
                        )}
                      </td>
                      <td className="p-6">
                        <span
                          className={`inline-flex items-center  text-xs font-medium ${
                            product.isAvailable
                              ? "text-green-300"
                              : "text-red-300"
                          }`}
                        >
                          {product.isAvailable ? "In Stock" : "Out of Stock"}
                        </span>
                      </td>
                      <td className="p-6">
                        <span
                          className={`font-medium ${
                            product.bestSeller
                              ? "text-green-300"
                              : "text-red-300"
                          }`}
                        >
                          {product.bestSeller ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="p-6">
                        <span
                          className={`font-medium ${
                            product.newArrival
                              ? "text-green-300"
                              : "text-red-300"
                          }`}
                        >
                          {product.newArrival ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="p-6">
                        <div className="text-sm text-muted-foreground">
                          {formatDate(product.createdAt)}
                        </div>
                      </td>
                      <td className="">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditClick(product)}
                            className="p-2 hover:bg-muted rounded transition-colors"
                            title="Edit product"
                          >
                            <Pencil className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(product)}
                            className="p-2 hover:bg-muted rounded transition-colors"
                            title="Delete product"
                          >
                            <Trash2 className="h-4 w-4 text-muted-foreground hover:text-red-600" />
                          </button>
                          <Link
                            to={`/admin/products/update_product/${product._id}`}
                          >
                            <button
                              className="p-2 hover:bg-muted rounded transition-colors"
                              title="Update product"
                            >
                              <SquarePen className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                            </button>
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
              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className="p-6 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex gap-4 mb-4">
                    <Link
                      to={`/admin/products/product_details/${product._id}`}
                      className="flex items-center gap-4"
                    >
                      <img
                        src={product.imageUrls[0]}
                        alt={product.name}
                        className="w-20 h-20 object-cover border border-border"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium mb-1">
                          {product.name}
                        </div>
                        <div className="text-xs text-muted-foreground mb-2">
                          {product.brand}
                        </div>
                        <div className="text-sm font-medium">
                          {formatCurrency(product.price)}
                        </div>
                      </div>
                    </Link>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Category:</span>
                      <span>{product.category}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Stock:</span>
                      <span
                        className={`px-2 py-0.5 ${
                          product.isAvailable
                            ? "text-green-300"
                            : "text-red-300"
                        }`}
                      >
                        {product.isAvailable ? "In Stock" : "Out of Stock"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-border">
                      <span className="text-muted-foreground">
                        Best Seller:
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 
                          ${
                            product.bestSeller
                              ? "text-green-300"
                              : "text-red-300"
                          }`}
                      >
                        {product.bestSeller ? "Yes" : "No"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        New Arrival:
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 
                          ${
                            product.newArrival
                              ? "text-green-300"
                              : "text-red-300"
                          }`}
                      >
                        {product.newArrival ? "Yes" : "No"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-border">
                      <button
                        onClick={() => handleEditClick(product)}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm bg-background border border-border hover:bg-muted transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(product)}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm  bg-foreground hover:bg-foreground/90  border border-red-200 text-red-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                    <div className="text-xs text-muted-foreground text-right">
                      Added {formatDate(product.createdAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Pagination */}
        {!loading && filteredProducts && filteredProducts.length > 0 && (
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

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px] text-foreground">
          <DialogHeader>
            <DialogTitle className="text-foreground text-xl font-light tracking-tight">
              Update Product
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Update product properties for {selectedProduct?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4 text-foreground">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="bestSeller"
                className="text-sm font-medium text-foreground"
              >
                Best Seller
              </Label>
              <Switch
                id="bestSeller"
                checked={editForm.bestSeller}
                onCheckedChange={(checked) =>
                  setEditForm({ ...editForm, bestSeller: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label
                htmlFor="newArrival"
                className="text-sm font-medium text-foreground"
              >
                New Arrival
              </Label>
              <Switch
                id="newArrival"
                checked={editForm.newArrival}
                onCheckedChange={(checked) =>
                  setEditForm({ ...editForm, newArrival: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label
                htmlFor="isAvailable"
                className="text-sm font-medium text-foreground"
              >
                In Stock
              </Label>
              <Switch
                id="isAvailable"
                checked={editForm.isAvailable}
                onCheckedChange={(checked) =>
                  setEditForm({ ...editForm, isAvailable: checked })
                }
              />
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
              onClick={handleUpdateProduct}
              className="px-4 py-2 text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Update Product
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px] text-foreground">
          <DialogHeader>
            <DialogTitle className="text-foreground text-xl font-light tracking-tight">
              Delete Product
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Are you sure you want to delete "{selectedProduct?.name}"? This
              action cannot be undone.
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
              onClick={handleDeleteProduct}
              className="px-4 py-2 text-sm bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              Delete Product
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProducts;
