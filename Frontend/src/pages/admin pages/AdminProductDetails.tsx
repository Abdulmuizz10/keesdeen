import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Star,
  Package,
  Tag,
  Palette,
  Ruler,
  Users,
  MessageSquare,
  ExternalLink,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import axiosInstance from "@/lib/axiosConfig";

interface Review {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  createdAt: string;
}

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
  reviews: Review[];
  createdAt: string;
  updatedAt: string;
}

const AdminProductDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          `/products/admin/get-product/${id}`
        );

        if (response.status === 200) {
          setProduct(response.data.product);
          setAverageRating(parseFloat(response.data.averageRating));
          setTotalReviews(response.data.totalReviews);
          setSelectedImage(response.data.product.imageUrls[0]);
        }
      } catch (error) {
        toast.error("Failed to fetch product details");
        navigate("/admin/products");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, navigate]);

  const handleDelete = async () => {
    try {
      const response = await axiosInstance.delete(
        `/products/admin/products/${id}`
      );

      if (response.status === 200) {
        toast.success("Product deleted successfully");
        navigate("/admin/products");
      }
    } catch (error) {
      toast.error("Failed to delete product");
    } finally {
      setDeleteDialogOpen(false);
    }
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

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? "fill-yellow-500 text-yellow-500"
                : "text-muted-foreground"
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const discount = product.previousPrice
    ? Math.round(
        ((product.previousPrice - product.price) / product.previousPrice) * 100
      )
    : 0;

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-5 border-b border-border pb-6">
          <button
            onClick={() => navigate("/admin/products")}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </button>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl lg:text-5xl font-light tracking-tight mb-2">
                {product.name}
              </h1>
              <p className="text-sm text-muted-foreground">{product.brand}</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  navigate(`/admin/products/update_product/${product._id}`)
                }
                className="inline-flex items-center gap-2 px-6 py-3 border border-border hover:bg-muted transition-colors"
              >
                <Edit className="h-4 w-4" />
                Edit
              </button>
              <button
                onClick={() => setDeleteDialogOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-foreground hover:bg-foreground/90 transition-colors text-red-600"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Image */}
            <div className="aspect-square border border-border bg-card">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-5 gap-3">
              {product.imageUrls.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(image)}
                  className={`aspect-square border transition-all ${
                    selectedImage === image
                      ? "border-foreground"
                      : "border-border hover:border-muted-foreground"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Product Description */}
            <div className="border-t border-border pt-6">
              <h2 className="text-xl font-light tracking-tight mb-4">
                Description
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Reviews Section */}
            <div className="border-t border-border pt-6 hidden md:block">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-light tracking-tight">
                  Customer Reviews
                </h2>
                <div className="flex items-center gap-2">
                  {renderStars(Math.round(averageRating))}
                  <span className="text-sm text-muted-foreground">
                    {averageRating.toFixed(1)} ({totalReviews} reviews)
                  </span>
                </div>
              </div>

              {product.reviews.length > 0 ? (
                <div className="space-y-4">
                  {product.reviews.map((review) => (
                    <div
                      key={review._id}
                      className="p-4 border border-border bg-card"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-sm">{review.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(review.createdAt)}
                          </p>
                        </div>
                        {renderStars(review.rating)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border border-dashed border-border">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No reviews yet
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <div className="border border-border p-6">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-3xl font-light">
                  {formatCurrency(product.price)}
                </span>
                {product.previousPrice > product.price && (
                  <>
                    <span className="text-lg text-muted-foreground line-through">
                      {formatCurrency(product.previousPrice)}
                    </span>
                    <span className="text-sm bg-red-100 text-red-800 px-2 py-1">
                      -{discount}%
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Inclusive of all taxes
              </p>
            </div>

            {/* Status Badges */}
            <div className="border border-border p-6 space-y-3">
              <h3 className="text-sm font-medium mb-4">Product Status</h3>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Availability
                </span>
                <span
                  className={`text-xs px-3 py-2 ${
                    product.isAvailable
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {product.isAvailable ? "In Stock" : "Out of Stock"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Best Seller
                </span>
                <span
                  className={`text-xs px-3 py-1 ${
                    product.bestSeller ? "text-green-200" : "text-red-300"
                  }`}
                >
                  {product.bestSeller ? "Yes" : "No"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  New Arrival
                </span>
                <span
                  className={`text-xs px-3 py-1 
                     ${product.newArrival ? "text-green-200" : "text-red-300"}
                    `}
                >
                  {product.newArrival ? "Yes" : "No"}
                </span>
              </div>
            </div>

            {/* Product Details */}
            <div className="border border-border p-6 space-y-4">
              <h3 className="text-sm font-medium mb-4">Product Details</h3>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Tag className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-1">
                      Category
                    </p>
                    <p className="text-sm">{product.category}</p>
                    <p className="text-xs text-muted-foreground">
                      {product.subcategory}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Package className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-1">Type</p>
                    <p className="text-sm">{product.type || "Not specified"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-1">Gender</p>
                    <p className="text-sm">{product.gender}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Palette className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-1">Colors</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {product.colors.map((color) => (
                        <span
                          key={color}
                          className="text-xs px-2 py-1 bg-muted"
                        >
                          {color}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Ruler className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-1">Sizes</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {product.sizes.map((size) => (
                        <span key={size} className="text-xs px-2 py-1 bg-muted">
                          {size}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div className="border border-border p-6 space-y-3">
              <h3 className="text-sm font-medium mb-4">Metadata</h3>

              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Product ID</span>
                <span className="font-mono">{product._id.slice(-8)}</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Created</span>
                <span>{formatDate(product.createdAt)}</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Last Updated</span>
                <span>{formatDate(product.updatedAt)}</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Total Reviews</span>
                <span>{totalReviews}</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="border border-border p-6">
              <h3 className="text-sm font-medium mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() =>
                    window.open(`/product_details/${product._id}`, "_blank")
                  }
                  className="w-full flex items-center justify-between px-4 py-3 text-sm border border-border hover:bg-muted transition-colors"
                >
                  <span>View on Store</span>
                  <ExternalLink className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${window.location.origin}/products/${product._id}`
                    );
                    toast.success("Product link copied!");
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 text-sm border border-border hover:bg-muted transition-colors"
                >
                  <span>Copy Product Link</span>
                  <Package className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-foreground text-xl font-light tracking-tight">
              Delete Product
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{product.name}"? This action
              cannot be undone.
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
              onClick={handleDelete}
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

export default AdminProductDetails;
