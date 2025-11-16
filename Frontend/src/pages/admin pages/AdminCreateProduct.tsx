import React, { useState } from "react";
import { toast } from "sonner";
import { useShop } from "../../context/ShopContext";
import { X, Plus, Upload, Check, ChevronsUpDown } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import Axios from "axios";
import { URL } from "@/lib/constants";

const popularColors = [
  { name: "Black", code: "#000000" },
  { name: "White", code: "#FFFFFF" },
  { name: "Gray", code: "#808080" },
  { name: "Blue", code: "#0000FF" },
  { name: "Red", code: "#FF0000" },
  { name: "Green", code: "#008000" },
  { name: "Yellow", code: "#FFFF00" },
  { name: "Pink", code: "#FFC0CB" },
  { name: "Brown", code: "#A52A2A" },
  { name: "Beige", code: "#F5F5DC" },
  { name: "Navy Blue", code: "#000080" },
  { name: "Burgundy", code: "#800020" },
  { name: "Sky Blue", code: "#87CEEB" },
  { name: "Olive", code: "#808000" },
  { name: "Mint", code: "#98FF98" },
  { name: "Lavender", code: "#E6E6FA" },
];

interface SelectDropdownProps {
  label?: string;
  value: string;
  options: string[];
  onChange: (val: string) => void;
  disabled?: boolean;
}

const SelectDropdown = ({
  value,
  options,
  onChange,
  disabled,
}: SelectDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger disabled={disabled} className="w-full">
        <div className="relative flex items-center gap-2 pl-4 pr-8 py-3 bg-background border border-input text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
          <span className="truncate">{value || "Select option"}</span>

          <ChevronsUpDown className="absolute right-3 h-4 w-4 text-muted-foreground" />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="min-w-[--radix-dropdown-menu-trigger-width] rounded-none">
        {options.map((opt) => (
          <DropdownMenuItem
            key={opt}
            onClick={() => onChange(opt)}
            className="flex items-center justify-between"
          >
            {opt}

            {value === opt && <Check className="h-4 w-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const AdminCreateProduct: React.FC = () => {
  const [productName, setProductName] = useState<string>("");
  const [productBrand, setProductBrand] = useState<string>("");
  const [productDescription, setProductDescription] = useState<string>("");
  const [productCategory, setProductCategory] = useState<string>("");
  const [productSubCategory, setProductSubCategory] = useState<string>("");
  const [productType, setProductType] = useState<string>("");
  const [productSex, setProductSex] = useState<string>("");
  const [productColors, setProductColors] = useState<string[]>([]);
  const [productPreviousPrice, setProductPreviousPrice] = useState<string>("");
  const [productPrice, setProductPrice] = useState<string>("");
  const [productSizes, setProductSizes] = useState<string[]>([]);
  const [productImages, setProductImages] = useState<string[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [bestSeller, setBestSeller] = useState<boolean>(false);
  const [newArrival, setNewArrival] = useState<boolean>(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const { setAdminLoader } = useShop();

  const handleColorToggle = (color: string) => {
    if (productColors.includes(color)) {
      setProductColors(productColors.filter((s) => s !== color));
    } else {
      setProductColors([...productColors, color]);
    }
  };

  const handleSizeToggle = (size: string) => {
    if (productSizes.includes(size)) {
      setProductSizes(productSizes.filter((s) => s !== size));
    } else {
      setProductSizes([...productSizes, size]);
    }
  };

  const handleAddImageSlot = () => {
    setImagePreviews([...imagePreviews, ""]);
    setProductImages([...productImages, ""]);
  };

  const handleRemoveImage = (index: number) => {
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    const updatedImages = productImages.filter((_, i) => i !== index);
    setImagePreviews(updatedPreviews);
    setProductImages(updatedImages);
  };

  const handleImageChange = (index: number, file: File | null) => {
    if (file) {
      const updatedPreviews = [...imagePreviews];
      updatedPreviews[index] = window.URL.createObjectURL(file);
      setImagePreviews(updatedPreviews);

      uploadToCloudinary(file, index);
    }
  };

  const uploadToCloudinary = async (file: File, index: number) => {
    setUploadingIndex(index);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_PRESET);
    formData.append("folder", "product_images");

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        }/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      if (data.secure_url) {
        const updatedImages = [...productImages];
        updatedImages[index] = data.secure_url;
        setProductImages(updatedImages);
        toast.success("Image uploaded successfully");
      }
    } catch (error) {
      toast.error("Image upload failed");
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (productImages.filter((img) => img).length === 0) {
      toast.error("Please upload at least one product image");
      return;
    }

    if (productColors.length === 0) {
      toast.error("Please select at least one color");
      return;
    }

    if (productSizes.length === 0) {
      toast.error("Please select at least one size");
      return;
    }

    const formData = {
      name: productName,
      brand: productBrand,
      description: productDescription,
      category: productCategory,
      subcategory: productSubCategory,
      type: productType,
      gender: productSex,
      colors: productColors,
      previousPrice: productPreviousPrice,
      price: productPrice,
      bestSeller: bestSeller,
      newArrival: newArrival,
      sizes: productSizes,
      imageUrls: productImages.filter((img) => img),
    };

    try {
      const res = await Axios.post(`${URL}/products/create-product`, formData, {
        withCredentials: true,
        validateStatus: (status: any) => status < 600,
      });
      if (res.status === 200) {
        toast.success("Product created successfully!");
        setProductName("");
        setProductBrand("");
        setProductDescription("");
        setProductCategory("");
        setProductSubCategory("");
        setProductType("");
        setProductSex("");
        setProductColors([]);
        setProductPreviousPrice("");
        setProductPrice("");
        setProductSizes([]);
        setProductImages([]);
        setImagePreviews([]);
        setBestSeller(false);
        setNewArrival(false);
        setAdminLoader(false);
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
    } catch (err) {
      toast.error("Something wrong, Product deleted!");
    } finally {
      setAdminLoader(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-5 border-b border-border pb-8">
          <h1 className="text-3xl lg:text-5xl font-light tracking-tight mb-3">
            Create New Product
          </h1>
          <p className="text-sm text-muted-foreground">
            Add a new product to your inventory with detailed information
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Product Images Section */}
          <section className="space-y-6">
            <div>
              <h2 className="text-xl font-light tracking-tight mb-2">
                Product Images
              </h2>
              <p className="text-sm text-muted-foreground">
                Upload high-quality images. First image will be the main
                display.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {imagePreviews.map((preview, index) => (
                <div
                  key={index}
                  className="relative aspect-square border border-border bg-card group"
                >
                  {preview ? (
                    <>
                      <img
                        src={preview}
                        alt={`Product ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 p-1.5 bg-background/90 border border-border opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      {uploadingIndex === index && (
                        <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                          <div className="animate-spin h-6 w-6 border-2 border-foreground border-t-transparent rounded-full" />
                        </div>
                      )}
                      {index === 0 && (
                        <div className="absolute bottom-2 left-2 px-2 py-1 bg-background/90 border border-border text-xs">
                          Main
                        </div>
                      )}
                    </>
                  ) : (
                    <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                      <span className="text-xs text-muted-foreground">
                        Upload
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleImageChange(
                            index,
                            e.target.files ? e.target.files[0] : null
                          )
                        }
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              ))}

              {/* Add More Button */}
              <button
                type="button"
                onClick={handleAddImageSlot}
                className="aspect-square border border-dashed border-border hover:border-foreground hover:bg-muted/50 transition-colors flex flex-col items-center justify-center"
              >
                <Plus className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-xs text-muted-foreground">Add Image</span>
              </button>
            </div>
          </section>

          {/* Basic Information */}
          <section className="space-y-6">
            <div>
              <h2 className="text-xl font-light tracking-tight mb-2">
                Basic Information
              </h2>
              <p className="text-sm text-muted-foreground">
                Essential product details and pricing
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {/* Product Name <span className="text-red-500">*</span> */}
                  Product Name
                </Label>
                <input
                  type="text"
                  placeholder="Enter product name"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full px-4 py-3 bg-background border border-input focus:outline-none focus:border-foreground transition-colors"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Brand</Label>
                <input
                  type="text"
                  placeholder="Enter brand name"
                  value={productBrand}
                  onChange={(e) => setProductBrand(e.target.value)}
                  className="w-full px-4 py-3 bg-background border border-input focus:outline-none focus:border-foreground transition-colors"
                />
              </div>

              <div className="lg:col-span-2 space-y-2">
                <Label className="text-sm font-medium">
                  {/* Description <span className="text-red-500">*</span> */}
                  Description
                </Label>
                <textarea
                  placeholder="Detailed product description"
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  className="w-full px-4 py-3 bg-background border border-input focus:outline-none focus:border-foreground transition-colors min-h-[120px] resize-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {/* Price (£) <span className="text-red-500">*</span> */}
                  Price (£)
                </Label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                  className="w-full px-4 py-3 bg-background border border-input focus:outline-none focus:border-foreground transition-colors"
                  step="0.01"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Previous Price (£)
                </Label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={productPreviousPrice}
                  onChange={(e) => setProductPreviousPrice(e.target.value)}
                  className="w-full px-4 py-3 bg-background border border-input focus:outline-none focus:border-foreground transition-colors"
                  step="0.01"
                />
              </div>
            </div>
          </section>

          {/* Categorization */}
          <section className="space-y-6">
            <div>
              <h2 className="text-xl font-light tracking-tight mb-2">
                Categorization
              </h2>
              <p className="text-sm text-muted-foreground">
                Organize your product for easy discovery
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Category</Label>
                {/* <select
                  value={productCategory}
                  onChange={(e) => setProductCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-background border border-input focus:outline-none focus:border-foreground transition-colors"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Active Wear">Active Wear</option>
                  <option value="Fitness Accessories">
                    Fitness Accessories
                  </option>
                </select> */}
                <SelectDropdown
                  value={productCategory}
                  onChange={setProductCategory}
                  options={["Active Wear", "Fitness Accessories"]}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Sub-Category</Label>
                {/* <select
                  value={productSubCategory}
                  onChange={(e) => setProductSubCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-background border border-input focus:outline-none focus:border-foreground transition-colors"
                  required
                  disabled={!productCategory}
                >
                  <option value="">Select Sub-Category</option>
                  {productCategory === "Active Wear" ? (
                    <>
                      <option value="Modest Workout Tops">
                        Modest Workout Tops
                      </option>
                      <option value="Joggers & Bottoms">
                        Joggers & Bottoms
                      </option>
                      <option value="Complete Active Wear Sets">
                        Complete Active wear Sets
                      </option>
                      <option value="High-Support Sports Bras">
                        High-Support Sports Bras
                      </option>
                      <option value="Sports Hijabs">Sports Hijabs</option>
                      <option value="Burkinis / Swimwear">
                        Burkinis / Swimwear
                      </option>
                    </>
                  ) : (
                    <>
                      <option value="Gym Essentials Kit">
                        Gym Essentials Kit
                      </option>
                      <option value="Workout Bag">Workout Bag</option>
                      <option value="Water Bottle">Water Bottle</option>
                      <option value="Sweat Towel">Sweat Towel</option>
                      <option value="Athletic Socks">Athletic Socks</option>
                    </>
                  )}
                </select> */}
                <SelectDropdown
                  value={productSubCategory}
                  onChange={setProductSubCategory}
                  disabled={!productCategory}
                  options={
                    productCategory === "Active Wear"
                      ? [
                          "Modest Workout Tops",
                          "Joggers & Bottoms",
                          "Complete Active Wear Sets",
                          "High-Support Sports Bras",
                          "Sports Hijabs",
                          "Burkinis / Swimwear",
                        ]
                      : [
                          "Gym Essentials Kit",
                          "Workout Bag",
                          "Water Bottle",
                          "Sweat Towel",
                          "Athletic Socks",
                        ]
                  }
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Type</Label>
                {/* <select
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  className="w-full px-4 py-3 bg-background border border-input focus:outline-none focus:border-foreground transition-colors"
                >
                  <option value="">Select Type</option>
                  <option value="Top wear">Top Wear</option>
                  <option value="Bottom wear">Bottom Wear</option>
                  <option value="Foot wear">Foot Wear</option>
                </select> */}

                <SelectDropdown
                  value={productType}
                  onChange={setProductType}
                  options={["Top Wear", "Bottom Wear", "Foot Wear"]}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Gender</Label>
                {/* <select
                  value={productSex}
                  onChange={(e) => setProductSex(e.target.value)}
                  className="w-full px-4 py-3 bg-background border border-input focus:outline-none focus:border-foreground transition-colors"
                >
                  <option value="">Select Gender</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Unisex">Unisex</option>
                </select> */}

                <SelectDropdown
                  value={productSex}
                  onChange={setProductSex}
                  options={["Female", "Male", "Unisex"]}
                />
              </div>
            </div>
          </section>

          {/* Colors */}
          <section className="space-y-6">
            <div>
              <h2 className="text-xl font-light tracking-tight mb-2">
                Available Colors
              </h2>
              <p className="text-sm text-muted-foreground">
                Select all available color options
              </p>
            </div>

            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
              {popularColors.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => handleColorToggle(color.name)}
                  className="group relative"
                >
                  <div
                    className={`aspect-square border-2 transition-all ${
                      productColors.includes(color.name)
                        ? "border-foreground scale-95"
                        : "border-border hover:border-muted-foreground"
                    }`}
                    style={{ backgroundColor: color.code }}
                  >
                    {productColors.includes(color.name) && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-background/90 flex items-center justify-center">
                          <Check className="h-4 w-4" />
                        </div>
                      </div>
                    )}
                  </div>
                  <p
                    className={`mt-2 text-xs text-center transition-all ${
                      productColors.includes(color.name)
                        ? "font-medium"
                        : "text-muted-foreground"
                    }`}
                  >
                    {color.name}
                  </p>
                </button>
              ))}
            </div>
          </section>

          {/* Sizes */}
          <section className="space-y-6">
            <div>
              <h2 className="text-xl font-light tracking-tight mb-2">
                Available Sizes
              </h2>
              <p className="text-sm text-muted-foreground">
                Select all available size options
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {[
                "XXS",
                "XS",
                "S",
                "M",
                "L",
                "XL",
                "2XL",
                "3XL",
                "4XL",
                "5XL",
              ].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleSizeToggle(size)}
                  className={`min-w-[60px] px-4 py-3 border transition-all ${
                    productSizes.includes(size)
                      ? "border-foreground bg-foreground text-background"
                      : "border-border hover:border-foreground"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </section>

          {/* Product Features */}
          <section className="space-y-6">
            <div>
              <h2 className="text-xl font-light tracking-tight mb-2">
                Product Features
              </h2>
              <p className="text-sm text-muted-foreground">
                Highlight special product attributes
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center justify-between p-6 border border-border">
                <div>
                  <Label className="text-sm font-medium">Best Seller</Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Mark as a best-selling product
                  </p>
                </div>
                <Switch checked={bestSeller} onCheckedChange={setBestSeller} />
              </div>

              <div className="flex items-center justify-between p-6 border border-border">
                <div>
                  <Label className="text-sm font-medium">New Arrival</Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Mark as a new arrival product
                  </p>
                </div>
                <Switch checked={newArrival} onCheckedChange={setNewArrival} />
              </div>
            </div>
          </section>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-border">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-8 py-3 border border-border hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-foreground text-background hover:bg-foreground/90 transition-colors"
            >
              Create Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCreateProduct;
