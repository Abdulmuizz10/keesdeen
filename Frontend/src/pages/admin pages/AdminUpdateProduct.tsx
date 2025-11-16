// import React, { useState, useEffect } from "react";
// import { updateProduct } from "../../context/ProductContext/ProductApiCalls";
// import { toast } from "sonner";
// import { useParams, useNavigate } from "react-router-dom";
// import { useShop } from "../../context/ShopContext";
// import { X, Plus, Upload, Check, ChevronDown, ArrowLeft } from "lucide-react";
// import { Switch } from "@/components/ui/switch";
// import { Label } from "@/components/ui/label";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import Axios from "axios";
// import { URL } from "@/lib/constants";
// import { Spinner } from "@/components/ui/spinner";

// const popularColors = [
//   { name: "Black", code: "#000000" },
//   { name: "White", code: "#FFFFFF" },
//   { name: "Gray", code: "#808080" },
//   { name: "Blue", code: "#0000FF" },
//   { name: "Red", code: "#FF0000" },
//   { name: "Green", code: "#008000" },
//   { name: "Yellow", code: "#FFFF00" },
//   { name: "Pink", code: "#FFC0CB" },
//   { name: "Brown", code: "#A52A2A" },
//   { name: "Beige", code: "#F5F5DC" },
//   { name: "Navy Blue", code: "#000080" },
//   { name: "Burgundy", code: "#800020" },
//   { name: "Sky Blue", code: "#87CEEB" },
//   { name: "Olive", code: "#808000" },
//   { name: "Mint", code: "#98FF98" },
//   { name: "Lavender", code: "#E6E6FA" },
// ];

// interface Product {
//   _id: string;
//   name: string;
//   brand: string;
//   category: string;
//   subcategory: string;
//   type: string;
//   previousPrice: number;
//   price: number;
//   sizes: string[];
//   colors: string[];
//   newArrival: boolean;
//   bestSeller: boolean;
//   isAvailable: boolean;
//   gender: string;
//   imageUrls: string[];
//   description: string;
// }

// const AdminUpdateProduct: React.FC = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { setAdminLoader } = useShop();

//   // Loading states
//   const [loading, setLoading] = useState(true);
//   const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

//   // Original product data (for comparison)
//   const [originalProduct, setOriginalProduct] = useState<Product | null>(null);

//   // Form states
//   const [productName, setProductName] = useState<string>("");
//   const [productBrand, setProductBrand] = useState<string>("");
//   const [productDescription, setProductDescription] = useState<string>("");
//   const [productCategory, setProductCategory] = useState<string>("");
//   const [productSubCategory, setProductSubCategory] = useState<string>("");
//   const [productType, setProductType] = useState<string>("");
//   const [productSex, setProductSex] = useState<string>("");
//   const [productColors, setProductColors] = useState<string[]>([]);
//   const [productPreviousPrice, setProductPreviousPrice] = useState<string>("");
//   const [productPrice, setProductPrice] = useState<string>("");
//   const [productSizes, setProductSizes] = useState<string[]>([]);
//   const [productImages, setProductImages] = useState<string[]>([]);
//   const [imagePreviews, setImagePreviews] = useState<string[]>([]);
//   const [bestSeller, setBestSeller] = useState<boolean>(false);
//   const [newArrival, setNewArrival] = useState<boolean>(false);

//   // Fetch existing product data
//   useEffect(() => {
//     const fetchProduct = async () => {
//       setLoading(true);
//       try {
//         const response = await Axios.get(
//           `${URL}/products/admin/get-product/product/${id}`,
//           {
//             withCredentials: true,
//           }
//         );

//         if (response.status === 200) {
//           const product = response.data;
//           setOriginalProduct(product);

//           // Pre-populate all fields
//           setProductName(product.name || "");
//           setProductBrand(product.brand || "");
//           setProductDescription(product.description || "");
//           setProductCategory(product.category || "");
//           setProductSubCategory(product.subcategory || "");
//           setProductType(product.type || "");
//           setProductSex(product.gender || "");
//           setProductColors(product.colors || []);
//           setProductPreviousPrice(product.previousPrice?.toString() || "");
//           setProductPrice(product.price?.toString() || "");
//           setProductSizes(product.sizes || []);
//           setProductImages(product.imageUrls || []);
//           setImagePreviews(product.imageUrls || []);
//           setBestSeller(product.bestSeller || false);
//           setNewArrival(product.newArrival || false);
//         }
//       } catch (error) {
//         toast.error("Failed to fetch product details");
//         navigate("/admin/products");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) {
//       fetchProduct();
//     }
//   }, [id, navigate]);

//   const handleColorToggle = (color: string) => {
//     if (productColors.includes(color)) {
//       setProductColors(productColors.filter((s) => s !== color));
//     } else {
//       setProductColors([...productColors, color]);
//     }
//   };

//   const handleSizeToggle = (size: string) => {
//     if (productSizes.includes(size)) {
//       setProductSizes(productSizes.filter((s) => s !== size));
//     } else {
//       setProductSizes([...productSizes, size]);
//     }
//   };

//   const handleAddImageSlot = () => {
//     setImagePreviews([...imagePreviews, ""]);
//     setProductImages([...productImages, ""]);
//   };

//   const handleRemoveImage = (index: number) => {
//     const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
//     const updatedImages = productImages.filter((_, i) => i !== index);
//     setImagePreviews(updatedPreviews);
//     setProductImages(updatedImages);
//   };

//   const handleImageChange = (index: number, file: File | null) => {
//     if (file) {
//       const updatedPreviews = [...imagePreviews];
//       updatedPreviews[index] = URL.createObjectURL(file);
//       setImagePreviews(updatedPreviews);

//       uploadToCloudinary(file, index);
//     }
//   };

//   const uploadToCloudinary = async (file: File, index: number) => {
//     setUploadingIndex(index);
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_PRESET);
//     formData.append("folder", "product_images");

//     try {
//       const res = await fetch(
//         `https://api.cloudinary.com/v1_1/${
//           import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
//         }/image/upload`,
//         {
//           method: "POST",
//           body: formData,
//         }
//       );

//       const data = await res.json();
//       if (data.secure_url) {
//         const updatedImages = [...productImages];
//         updatedImages[index] = data.secure_url;
//         setProductImages(updatedImages);
//         toast.success("Image uploaded successfully");
//       }
//     } catch (error) {
//       toast.error("Image upload failed");
//     } finally {
//       setUploadingIndex(null);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!originalProduct) return;

//     // Build update object with only changed fields (industry standard)
//     const updates: Record<string, any> = { _id: id };

//     if (productName !== originalProduct.name) updates.name = productName;
//     if (productBrand !== originalProduct.brand) updates.brand = productBrand;
//     if (productDescription !== originalProduct.description)
//       updates.description = productDescription;
//     if (productCategory !== originalProduct.category)
//       updates.category = productCategory;
//     if (productSubCategory !== originalProduct.subcategory)
//       updates.subcategory = productSubCategory;
//     if (productType !== originalProduct.type) updates.type = productType;
//     if (productSex !== originalProduct.gender) updates.gender = productSex;

//     // Compare arrays
//     if (
//       JSON.stringify(productColors) !== JSON.stringify(originalProduct.colors)
//     )
//       updates.colors = productColors;
//     if (JSON.stringify(productSizes) !== JSON.stringify(originalProduct.sizes))
//       updates.sizes = productSizes;
//     if (
//       JSON.stringify(productImages.filter((img) => img)) !==
//       JSON.stringify(originalProduct.imageUrls)
//     )
//       updates.imageUrls = productImages.filter((img) => img);

//     // Compare numbers
//     if (
//       parseFloat(productPrice) !== originalProduct.price &&
//       productPrice !== ""
//     )
//       updates.price = parseFloat(productPrice);
//     if (
//       parseFloat(productPreviousPrice || "0") !==
//         originalProduct.previousPrice &&
//       productPreviousPrice !== ""
//     )
//       updates.previousPrice = parseFloat(productPreviousPrice);

//     // Compare booleans
//     if (bestSeller !== originalProduct.bestSeller)
//       updates.bestSeller = bestSeller;
//     if (newArrival !== originalProduct.newArrival)
//       updates.newArrival = newArrival;

//     // Validate
//     if (Object.keys(updates).length === 1) {
//       toast.info("No changes detected");
//       return;
//     }

//     if (productColors.length === 0) {
//       toast.error("Please select at least one color");
//       return;
//     }

//     if (productSizes.length === 0) {
//       toast.error("Please select at least one size");
//       return;
//     }

//     if (productImages.filter((img) => img).length === 0) {
//       toast.error("Please upload at least one product image");
//       return;
//     }

//     await updateProduct(
//       updates,
//       setProductName,
//       setProductBrand,
//       setProductDescription,
//       setProductCategory,
//       setProductSubCategory,
//       setProductType,
//       setProductSex,
//       setProductColors,
//       setProductPreviousPrice,
//       setProductPrice,
//       setProductSizes,
//       setProductImages,
//       setImagePreviews,
//       setBestSeller,
//       setNewArrival,
//       navigate,
//       setAdminLoader
//     );
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <Spinner className="size-8" />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-background p-4">
//       <div className="">
//         {/* Header */}
//         <div className="mb-5 border-b border-border pb-8">
//           <button
//             onClick={() => navigate("/admin/products")}
//             className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
//           >
//             <ArrowLeft className="h-4 w-4" />
//             Back to Products
//           </button>
//           <h1 className="text-3xl lg:text-5xl font-light tracking-tight mb-3">
//             Update Product
//           </h1>
//           <p className="text-sm text-muted-foreground">
//             Modify product details and save changes
//           </p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-12">
//           {/* Product Images Section */}
//           <section className="space-y-6">
//             <div>
//               <h2 className="text-xl font-light tracking-tight mb-2">
//                 Product Images
//               </h2>
//               <p className="text-sm text-muted-foreground">
//                 Update product images. First image will be the main display.
//               </p>
//             </div>

//             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
//               {imagePreviews.map((preview, index) => (
//                 <div
//                   key={index}
//                   className="relative aspect-square border border-border bg-card group"
//                 >
//                   {preview ? (
//                     <>
//                       <img
//                         src={preview}
//                         alt={`Product ${index + 1}`}
//                         className="w-full h-full object-cover"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => handleRemoveImage(index)}
//                         className="absolute top-2 right-2 p-1.5 bg-background/90 border border-border opacity-0 group-hover:opacity-100 transition-opacity"
//                       >
//                         <X className="h-4 w-4" />
//                       </button>
//                       {uploadingIndex === index && (
//                         <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
//                           <div className="animate-spin h-6 w-6 border-2 border-foreground border-t-transparent rounded-full" />
//                         </div>
//                       )}
//                       {index === 0 && (
//                         <div className="absolute bottom-2 left-2 px-2 py-1 bg-background/90 border border-border text-xs">
//                           Main
//                         </div>
//                       )}
//                       <label className="absolute inset-0 cursor-pointer opacity-0 hover:opacity-100 bg-background/80 flex items-center justify-center transition-opacity">
//                         <div className="text-center">
//                           <Upload className="h-6 w-6 mx-auto mb-1" />
//                           <span className="text-xs">Replace</span>
//                         </div>
//                         <input
//                           type="file"
//                           accept="image/*"
//                           onChange={(e) =>
//                             handleImageChange(
//                               index,
//                               e.target.files ? e.target.files[0] : null
//                             )
//                           }
//                           className="hidden"
//                         />
//                       </label>
//                     </>
//                   ) : (
//                     <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
//                       <Upload className="h-8 w-8 text-muted-foreground mb-2" />
//                       <span className="text-xs text-muted-foreground">
//                         Upload
//                       </span>
//                       <input
//                         type="file"
//                         accept="image/*"
//                         onChange={(e) =>
//                           handleImageChange(
//                             index,
//                             e.target.files ? e.target.files[0] : null
//                           )
//                         }
//                         className="hidden"
//                       />
//                     </label>
//                   )}
//                 </div>
//               ))}

//               {/* Add More Button */}
//               <button
//                 type="button"
//                 onClick={handleAddImageSlot}
//                 className="aspect-square border border-dashed border-border hover:border-foreground hover:bg-muted/50 transition-colors flex flex-col items-center justify-center"
//               >
//                 <Plus className="h-8 w-8 text-muted-foreground mb-2" />
//                 <span className="text-xs text-muted-foreground">Add Image</span>
//               </button>
//             </div>
//           </section>

//           {/* Basic Information */}
//           <section className="space-y-6">
//             <div>
//               <h2 className="text-xl font-light tracking-tight mb-2">
//                 Basic Information
//               </h2>
//               <p className="text-sm text-muted-foreground">
//                 Essential product details and pricing
//               </p>
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               <div className="space-y-2">
//                 <Label className="text-sm font-medium">Product Name</Label>
//                 <input
//                   type="text"
//                   placeholder="Enter product name"
//                   value={productName}
//                   onChange={(e) => setProductName(e.target.value)}
//                   className="w-full px-4 py-3 bg-background border border-input focus:outline-none focus:border-foreground transition-colors"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label className="text-sm font-medium">Brand</Label>
//                 <input
//                   type="text"
//                   placeholder="Enter brand name"
//                   value={productBrand}
//                   onChange={(e) => setProductBrand(e.target.value)}
//                   className="w-full px-4 py-3 bg-background border border-input focus:outline-none focus:border-foreground transition-colors"
//                 />
//               </div>

//               <div className="lg:col-span-2 space-y-2">
//                 <Label className="text-sm font-medium">Description</Label>
//                 <textarea
//                   placeholder="Detailed product description"
//                   value={productDescription}
//                   onChange={(e) => setProductDescription(e.target.value)}
//                   className="w-full px-4 py-3 bg-background border border-input focus:outline-none focus:border-foreground transition-colors min-h-[120px] resize-none"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label className="text-sm font-medium">Price (£)</Label>
//                 <input
//                   type="number"
//                   placeholder="0.00"
//                   value={productPrice}
//                   onChange={(e) => setProductPrice(e.target.value)}
//                   className="w-full px-4 py-3 bg-background border border-input focus:outline-none focus:border-foreground transition-colors"
//                   step="0.01"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label className="text-sm font-medium">
//                   Previous Price (£)
//                 </Label>
//                 <input
//                   type="number"
//                   placeholder="0.00"
//                   value={productPreviousPrice}
//                   onChange={(e) => setProductPreviousPrice(e.target.value)}
//                   className="w-full px-4 py-3 bg-background border border-input focus:outline-none focus:border-foreground transition-colors"
//                   step="0.01"
//                 />
//               </div>
//             </div>
//           </section>

//           {/* Categorization */}
//           <section className="space-y-6">
//             <div>
//               <h2 className="text-xl font-light tracking-tight mb-2">
//                 Categorization
//               </h2>
//               <p className="text-sm text-muted-foreground">
//                 Organize your product for easy discovery
//               </p>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               {/* Category Dropdown */}
//               <div className="space-y-2">
//                 <Label className="text-sm font-medium">Category</Label>
//                 <DropdownMenu>
//                   <DropdownMenuTrigger className="w-full">
//                     <div className="relative flex items-center justify-between px-4 py-3 bg-background border border-input text-sm cursor-pointer hover:border-foreground transition-colors">
//                       <span
//                         className={
//                           productCategory ? "" : "text-muted-foreground"
//                         }
//                       >
//                         {productCategory || "Select Category"}
//                       </span>
//                       <ChevronDown className="h-4 w-4 text-muted-foreground" />
//                     </div>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] rounded-none">
//                     {["Active Wear", "Fitness Accessories"].map((category) => (
//                       <DropdownMenuItem
//                         key={category}
//                         onClick={() => {
//                           setProductCategory(category);
//                           setProductSubCategory("");
//                         }}
//                         className="flex items-center justify-between"
//                       >
//                         {category}
//                         {productCategory === category && (
//                           <Check className="h-4 w-4 text-primary" />
//                         )}
//                       </DropdownMenuItem>
//                     ))}
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               </div>

//               {/* Sub-Category Dropdown */}
//               <div className="space-y-2">
//                 <Label className="text-sm font-medium">Sub-Category</Label>
//                 <DropdownMenu>
//                   <DropdownMenuTrigger
//                     className="w-full"
//                     disabled={!productCategory}
//                   >
//                     <div
//                       className={`relative flex items-center justify-between px-4 py-3 bg-background border border-input text-sm cursor-pointer transition-colors ${
//                         !productCategory
//                           ? "opacity-50 cursor-not-allowed"
//                           : "hover:border-foreground"
//                       }`}
//                     >
//                       <span
//                         className={
//                           productSubCategory ? "" : "text-muted-foreground"
//                         }
//                       >
//                         {productSubCategory || "Select Sub-Category"}
//                       </span>
//                       <ChevronDown className="h-4 w-4 text-muted-foreground" />
//                     </div>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] rounded-none">
//                     {productCategory === "Active Wear"
//                       ? [
//                           "Modest Workout Tops",
//                           "Joggers & Bottoms",
//                           "Complete Active Wear Sets",
//                           "High-Support Sports Bras",
//                           "Sports Hijabs",
//                           "Burkinis / Swimwear",
//                         ].map((subCategory) => (
//                           <DropdownMenuItem
//                             key={subCategory}
//                             onClick={() => setProductSubCategory(subCategory)}
//                             className="flex items-center justify-between"
//                           >
//                             {subCategory}
//                             {productSubCategory === subCategory && (
//                               <Check className="h-4 w-4 text-primary" />
//                             )}
//                           </DropdownMenuItem>
//                         ))
//                       : productCategory === "Fitness Accessories"
//                       ? [
//                           "Gym Essentials Kit",
//                           "Workout Bag",
//                           "Water Bottle",
//                           "Sweat Towel",
//                           "Athletic Socks",
//                         ].map((subCategory) => (
//                           <DropdownMenuItem
//                             key={subCategory}
//                             onClick={() => setProductSubCategory(subCategory)}
//                             className="flex items-center justify-between"
//                           >
//                             {subCategory}
//                             {productSubCategory === subCategory && (
//                               <Check className="h-4 w-4 text-primary" />
//                             )}
//                           </DropdownMenuItem>
//                         ))
//                       : null}
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               </div>

//               {/* Type Dropdown */}
//               <div className="space-y-2">
//                 <Label className="text-sm font-medium">Type</Label>
//                 <DropdownMenu>
//                   <DropdownMenuTrigger className="w-full">
//                     <div className="relative flex items-center justify-between px-4 py-3 bg-background border border-input text-sm cursor-pointer hover:border-foreground transition-colors">
//                       <span
//                         className={productType ? "" : "text-muted-foreground"}
//                       >
//                         {productType || "Select Type"}
//                       </span>
//                       <ChevronDown className="h-4 w-4 text-muted-foreground" />
//                     </div>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] rounded-none">
//                     {["Top wear", "Bottom wear", "Foot wear"].map((type) => (
//                       <DropdownMenuItem
//                         key={type}
//                         onClick={() => setProductType(type)}
//                         className="flex items-center justify-between"
//                       >
//                         {type}
//                         {productType === type && (
//                           <Check className="h-4 w-4 text-primary" />
//                         )}
//                       </DropdownMenuItem>
//                     ))}
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               </div>

//               {/* Gender Dropdown */}
//               <div className="space-y-2">
//                 <Label className="text-sm font-medium">Gender</Label>
//                 <DropdownMenu>
//                   <DropdownMenuTrigger className="w-full">
//                     <div className="relative flex items-center justify-between px-4 py-3 bg-background border border-input text-sm cursor-pointer hover:border-foreground transition-colors">
//                       <span
//                         className={productSex ? "" : "text-muted-foreground"}
//                       >
//                         {productSex || "Select Gender"}
//                       </span>
//                       <ChevronDown className="h-4 w-4 text-muted-foreground" />
//                     </div>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] rounded-none">
//                     {["Female", "Male", "Unisex"].map((gender) => (
//                       <DropdownMenuItem
//                         key={gender}
//                         onClick={() => setProductSex(gender)}
//                         className="flex items-center justify-between"
//                       >
//                         {gender}
//                         {productSex === gender && (
//                           <Check className="h-4 w-4 text-primary" />
//                         )}
//                       </DropdownMenuItem>
//                     ))}
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               </div>
//             </div>
//           </section>

//           {/* Colors */}
//           <section className="space-y-6">
//             <div>
//               <h2 className="text-xl font-light tracking-tight mb-2">
//                 Available Colors
//               </h2>
//               <p className="text-sm text-muted-foreground">
//                 Select all available color options
//               </p>
//             </div>

//             <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
//               {popularColors.map((color) => (
//                 <button
//                   key={color.name}
//                   type="button"
//                   onClick={() => handleColorToggle(color.name)}
//                   className="group relative"
//                 >
//                   <div
//                     className={`aspect-square border-2 transition-all ${
//                       productColors.includes(color.name)
//                         ? "border-foreground scale-95"
//                         : "border-border hover:border-muted-foreground"
//                     }`}
//                     style={{ backgroundColor: color.code }}
//                   >
//                     {productColors.includes(color.name) && (
//                       <div className="absolute inset-0 flex items-center justify-center">
//                         <div className="w-6 h-6 rounded-full bg-background/90 flex items-center justify-center">
//                           <Check className="h-4 w-4" />
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                   <p
//                     className={`mt-2 text-xs text-center transition-all ${
//                       productColors.includes(color.name)
//                         ? "font-medium"
//                         : "text-muted-foreground"
//                     }`}
//                   >
//                     {color.name}
//                   </p>
//                 </button>
//               ))}
//             </div>
//           </section>

//           {/* Sizes */}
//           <section className="space-y-6">
//             <div>
//               <h2 className="text-xl font-light tracking-tight mb-2">
//                 Available Sizes
//               </h2>
//               <p className="text-sm text-muted-foreground">
//                 Select all available size options
//               </p>
//             </div>

//             <div className="flex flex-wrap gap-3">
//               {[
//                 "XXS",
//                 "XS",
//                 "S",
//                 "M",
//                 "L",
//                 "XL",
//                 "2XL",
//                 "3XL",
//                 "4XL",
//                 "5XL",
//               ].map((size) => (
//                 <button
//                   key={size}
//                   type="button"
//                   onClick={() => handleSizeToggle(size)}
//                   className={`min-w-[60px] px-4 py-3 border transition-all ${
//                     productSizes.includes(size)
//                       ? "border-foreground bg-foreground text-background"
//                       : "border-border hover:border-foreground"
//                   }`}
//                 >
//                   {size}
//                 </button>
//               ))}
//             </div>
//           </section>

//           {/* Product Features */}
//           <section className="space-y-6">
//             <div>
//               <h2 className="text-xl font-light tracking-tight mb-2">
//                 Product Features
//               </h2>
//               <p className="text-sm text-muted-foreground">
//                 Highlight special product attributes
//               </p>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="flex items-center justify-between p-6 border border-border">
//                 <div>
//                   <Label className="text-sm font-medium">Best Seller</Label>
//                   <p className="text-xs text-muted-foreground mt-1">
//                     Mark as a best-selling product
//                   </p>
//                 </div>
//                 <Switch checked={bestSeller} onCheckedChange={setBestSeller} />
//               </div>

//               <div className="flex items-center justify-between p-6 border border-border">
//                 <div>
//                   <Label className="text-sm font-medium">New Arrival</Label>
//                   <p className="text-xs text-muted-foreground mt-1">
//                     Mark as a new arrival product
//                   </p>
//                 </div>
//                 <Switch checked={newArrival} onCheckedChange={setNewArrival} />
//               </div>
//             </div>
//           </section>

//           {/* Submit Buttons */}
//           <div className="flex items-center justify-between gap-4 pt-6 border-t border-border">
//             <button
//               type="button"
//               onClick={() => navigate("/admin/products")}
//               className="px-8 py-3 border border-border hover:bg-muted transition-colors"
//             >
//               Cancel
//             </button>
//             <div className="flex items-center gap-4">
//               <button
//                 type="button"
//                 onClick={() => {
//                   if (originalProduct) {
//                     // Reset to original values
//                     setProductName(originalProduct.name || "");
//                     setProductBrand(originalProduct.brand || "");
//                     setProductDescription(originalProduct.description || "");
//                     setProductCategory(originalProduct.category || "");
//                     setProductSubCategory(originalProduct.subcategory || "");
//                     setProductType(originalProduct.type || "");
//                     setProductSex(originalProduct.gender || "");
//                     setProductColors(originalProduct.colors || []);
//                     setProductPreviousPrice(
//                       originalProduct.previousPrice?.toString() || ""
//                     );
//                     setProductPrice(originalProduct.price?.toString() || "");
//                     setProductSizes(originalProduct.sizes || []);
//                     setProductImages(originalProduct.imageUrls || []);
//                     setImagePreviews(originalProduct.imageUrls || []);
//                     setBestSeller(originalProduct.bestSeller || false);
//                     setNewArrival(originalProduct.newArrival || false);
//                     toast.info("Changes discarded");
//                   }
//                 }}
//                 className="px-8 py-3 border border-border hover:bg-muted transition-colors"
//               >
//                 Reset Changes
//               </button>
//               <button
//                 type="submit"
//                 className="px-8 py-3 bg-foreground text-background hover:bg-foreground/90 transition-colors"
//               >
//                 Update Product
//               </button>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AdminUpdateProduct;

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useParams, useNavigate } from "react-router-dom";
import { useShop } from "../../context/ShopContext";
import {
  Upload,
  Check,
  ChevronDown,
  ArrowLeft,
  Save,
  Trash2,
  GripVertical,
  Plus,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Axios from "axios";
import { URL } from "@/lib/constants";
import { Spinner } from "@/components/ui/spinner";

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

const categories = {
  "Active Wear": [
    "Modest Workout Tops",
    "Joggers & Bottoms",
    "Complete Active Wear Sets",
    "High-Support Sports Bras",
    "Sports Hijabs",
    "Burkinis / Swimwear",
  ],
  "Fitness Accessories": [
    "Gym Essentials Kit",
    "Workout Bag",
    "Water Bottle",
    "Sweat Towel",
    "Athletic Socks",
  ],
};

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
}

const AdminUpdateProduct: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setAdminLoader } = useShop();

  // Loading states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [draggedImage, setDraggedImage] = useState<number | null>(null);

  // Original product data (for comparison)
  const [originalProduct, setOriginalProduct] = useState<Product | null>(null);

  // Form states
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
  const [isAvailable, setIsAvailable] = useState<boolean>(true);

  // Fetch existing product data
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await Axios.get(
          `${URL}/products/admin/get-product/${id}`,
          {
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          const product = response.data.product;
          setOriginalProduct(product);

          // Pre-populate all fields
          setProductName(product.name || "");
          setProductBrand(product.brand || "");
          setProductDescription(product.description || "");
          setProductCategory(product.category || "");
          setProductSubCategory(product.subcategory || "");
          setProductType(product.type || "");
          setProductSex(product.gender || "");
          setProductColors(product.colors || []);
          setProductPreviousPrice(product.previousPrice?.toString() || "");
          setProductPrice(product.price?.toString() || "");
          setProductSizes(product.sizes || []);
          setProductImages(product.imageUrls || []);
          setImagePreviews(product.imageUrls || []);
          setBestSeller(product.bestSeller || false);
          setNewArrival(product.newArrival || false);
          setIsAvailable(product.isAvailable ?? true);
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

  // Track changes
  useEffect(() => {
    if (!originalProduct) return;

    const currentState = {
      name: productName,
      brand: productBrand,
      description: productDescription,
      category: productCategory,
      subcategory: productSubCategory,
      type: productType,
      gender: productSex,
      colors: JSON.stringify(productColors.sort()),
      sizes: JSON.stringify(productSizes.sort()),
      imageUrls: JSON.stringify(productImages.filter((img) => img)),
      price: parseFloat(productPrice) || 0,
      previousPrice: parseFloat(productPreviousPrice) || 0,
      bestSeller,
      newArrival,
      isAvailable,
    };

    const originalState = {
      name: originalProduct.name,
      brand: originalProduct.brand,
      description: originalProduct.description,
      category: originalProduct.category,
      subcategory: originalProduct.subcategory,
      type: originalProduct.type,
      gender: originalProduct.gender,
      colors: JSON.stringify([...originalProduct.colors].sort()),
      sizes: JSON.stringify([...originalProduct.sizes].sort()),
      imageUrls: JSON.stringify(originalProduct.imageUrls),
      price: originalProduct.price,
      previousPrice: originalProduct.previousPrice,
      bestSeller: originalProduct.bestSeller,
      newArrival: originalProduct.newArrival,
      isAvailable: originalProduct.isAvailable,
    };

    setHasChanges(
      JSON.stringify(currentState) !== JSON.stringify(originalState)
    );
  }, [
    originalProduct,
    productName,
    productBrand,
    productDescription,
    productCategory,
    productSubCategory,
    productType,
    productSex,
    productColors,
    productSizes,
    productImages,
    productPrice,
    productPreviousPrice,
    bestSeller,
    newArrival,
    isAvailable,
  ]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasChanges]);

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
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload a valid image file");
        return;
      }

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
      } else {
        toast.error("Image upload failed");
      }
    } catch (error) {
      toast.error("Image upload failed");
    } finally {
      setUploadingIndex(null);
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedImage(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedImage === null || draggedImage === index) return;

    const newImages = [...productImages];
    const newPreviews = [...imagePreviews];

    const draggedImgItem = newImages[draggedImage];
    const draggedPreviewItem = newPreviews[draggedImage];

    newImages.splice(draggedImage, 1);
    newImages.splice(index, 0, draggedImgItem);

    newPreviews.splice(draggedImage, 1);
    newPreviews.splice(index, 0, draggedPreviewItem);

    setProductImages(newImages);
    setImagePreviews(newPreviews);
    setDraggedImage(index);
  };

  const handleDragEnd = () => {
    setDraggedImage(null);
  };

  const handleDiscard = () => {
    if (!originalProduct) return;

    setProductName(originalProduct.name);
    setProductBrand(originalProduct.brand);
    setProductDescription(originalProduct.description);
    setProductCategory(originalProduct.category);
    setProductSubCategory(originalProduct.subcategory);
    setProductType(originalProduct.type);
    setProductSex(originalProduct.gender);
    setProductColors([...originalProduct.colors]);
    setProductPreviousPrice(originalProduct.previousPrice?.toString() || "");
    setProductPrice(originalProduct.price?.toString() || "");
    setProductSizes([...originalProduct.sizes]);
    setProductImages([...originalProduct.imageUrls]);
    setImagePreviews([...originalProduct.imageUrls]);
    setBestSeller(originalProduct.bestSeller);
    setNewArrival(originalProduct.newArrival);
    setIsAvailable(originalProduct.isAvailable);

    toast.info("Changes discarded");
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!originalProduct) return;

    // Validation
    if (!productName.trim()) {
      toast.error("Product name is required");
      return;
    }

    if (!productPrice || parseFloat(productPrice) <= 0) {
      toast.error("Please enter a valid price");
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

    if (productImages.filter((img) => img).length === 0) {
      toast.error("Please upload at least one product image");
      return;
    }

    // Build update object with only changed fields (INDUSTRY STANDARD)
    const updates: Record<string, any> = {};

    if (productName !== originalProduct.name) updates.name = productName.trim();
    if (productBrand !== originalProduct.brand)
      updates.brand = productBrand.trim();
    if (productDescription !== originalProduct.description)
      updates.description = productDescription.trim();
    if (productCategory !== originalProduct.category)
      updates.category = productCategory;
    if (productSubCategory !== originalProduct.subcategory)
      updates.subcategory = productSubCategory;
    if (productType !== originalProduct.type) updates.type = productType;
    if (productSex !== originalProduct.gender) updates.gender = productSex;

    // Compare arrays using JSON.stringify for deep comparison
    if (
      JSON.stringify([...productColors].sort()) !==
      JSON.stringify([...originalProduct.colors].sort())
    )
      updates.colors = productColors;
    if (
      JSON.stringify([...productSizes].sort()) !==
      JSON.stringify([...originalProduct.sizes].sort())
    )
      updates.sizes = productSizes;

    const filteredImages = productImages.filter((img) => img);
    if (
      JSON.stringify(filteredImages) !==
      JSON.stringify(originalProduct.imageUrls)
    )
      updates.imageUrls = filteredImages;

    // Compare numbers
    const currentPrice = parseFloat(productPrice);
    const currentPrevPrice = parseFloat(productPreviousPrice || "0");

    if (!isNaN(currentPrice) && currentPrice !== originalProduct.price)
      updates.price = currentPrice;
    if (
      !isNaN(currentPrevPrice) &&
      currentPrevPrice !== originalProduct.previousPrice
    )
      updates.previousPrice = currentPrevPrice;

    // Compare booleans
    if (bestSeller !== originalProduct.bestSeller)
      updates.bestSeller = bestSeller;
    if (newArrival !== originalProduct.newArrival)
      updates.newArrival = newArrival;
    if (isAvailable !== originalProduct.isAvailable)
      updates.isAvailable = isAvailable;

    // Check if there are actual changes
    if (Object.keys(updates).length === 0) {
      toast.info("No changes detected");
      return;
    }

    setSaving(true);
    setAdminLoader(true);

    try {
      const res = await Axios.put(
        `${URL}/products/admin/${id}/update-product`,
        updates,
        {
          withCredentials: true,
          validateStatus: (status: any) => status < 600,
        }
      );

      if (res.status === 200) {
        toast.success("Product updated successfully!");
        // Update original product to prevent unsaved changes warning
        setOriginalProduct({ ...originalProduct, ...updates } as Product);
        setHasChanges(false);

        // Navigate after a brief delay
        setTimeout(() => {
          navigate("/admin/products");
        }, 500);
      } else {
        toast.error(res.data.message || "Failed to update product");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update product");
    } finally {
      setSaving(false);
      setAdminLoader(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-background border-b border-border shadow-sm">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button
                onClick={() => {
                  if (hasChanges) {
                    if (
                      window.confirm(
                        "You have unsaved changes. Are you sure you want to leave?"
                      )
                    ) {
                      navigate("/admin/products");
                    }
                  } else {
                    navigate("/admin/products");
                  }
                }}
                className="p-2 hover:bg-muted rounded-full transition-colors"
                title="Back to products"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl lg:text-4xl font-light tracking-tight mb-1">
                  Edit Product
                </h1>
                <p className="text-sm text-muted-foreground">
                  {hasChanges ? (
                    <span className="text-orange-600 font-medium">
                      ● Unsaved changes
                    </span>
                  ) : (
                    "All changes saved"
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleDiscard}
                disabled={!hasChanges}
                className="px-5 py-2.5 border text-sm font-medium border-border hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Discard
              </button>
              <button
                onClick={() => handleSubmit()}
                disabled={!hasChanges || saving}
                className="px-6 py-2.5 bg-foreground text-background hover:bg-foreground/90 transition-colors text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column - Images & Details */}
            <div className="lg:col-span-2 space-y-12">
              {/* Product Images */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl lg:text-2xl font-light tracking-tight">
                      Product Images
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Drag to reorder. First image is the cover.
                    </p>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {productImages.filter((img) => img).length} images
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div
                      key={index}
                      draggable={!!preview}
                      onDragStart={(e) => preview && handleDragStart(e, index)}
                      onDragOver={(e) => preview && handleDragOver(e, index)}
                      onDragEnd={handleDragEnd}
                      className={`relative aspect-[3/4] bg-muted border border-border group transition-all ${
                        preview ? "cursor-move hover:shadow-lg" : ""
                      } ${draggedImage === index ? "opacity-50 scale-95" : ""}`}
                    >
                      {preview ? (
                        <>
                          <img
                            src={preview}
                            alt={`Product ${index + 1}`}
                            className="w-full h-full object-cover"
                          />

                          {/* Drag Handle */}
                          <div className="absolute top-3 left-3 p-1.5 bg-background/95 border border-border opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                            <GripVertical className="w-4 h-4 text-muted-foreground" />
                          </div>

                          {/* Cover Badge */}
                          {index === 0 && (
                            <div className="absolute top-3 right-3 px-2.5 py-1 bg-foreground text-background text-xs font-semibold tracking-wide">
                              COVER
                            </div>
                          )}

                          {/* Action Overlay */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                            <label className="p-3 bg-background hover:bg-muted cursor-pointer transition-colors shadow-lg">
                              <Upload className="w-5 h-5" />
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                  e.target.files?.[0] &&
                                  handleImageChange(index, e.target.files[0])
                                }
                                className="hidden"
                              />
                            </label>
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="p-3 bg-background hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors shadow-lg"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>

                          {/* Uploading State */}
                          {uploadingIndex === index && (
                            <div className="absolute inset-0 bg-background/90 flex items-center justify-center">
                              <div className="w-8 h-8 border-3 border-foreground border-t-transparent rounded-full animate-spin" />
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
                              e.target.files?.[0] &&
                              handleImageChange(index, e.target.files[0])
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
                    className="aspect-[3/4] border border-dashed border-border hover:border-foreground hover:bg-muted/50 transition-colors flex flex-col items-center justify-center group"
                  >
                    <Plus className="h-8 w-8 text-muted-foreground group-hover:text-foreground mb-2 transition-colors" />
                    <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                      Add Image
                    </span>
                  </button>
                </div>
              </section>

              {/* Description */}
              <section>
                <Label className="text-xl font-light tracking-tight mb-4 block">
                  Description
                </Label>
                <textarea
                  placeholder="Tell customers about this product..."
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 bg-background border border-input focus:outline-none focus:border-foreground transition-colors resize-none"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  {productDescription.length} characters
                </p>
              </section>

              {/* Colors */}
              <section>
                <h2 className="text-xl font-light tracking-tight mb-4">
                  Available Colors
                </h2>
                <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
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
              <section>
                <h2 className="text-xl font-light tracking-tight mb-4">
                  Available Sizes
                </h2>
                <div className="flex flex-wrap gap-2">
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
            </div>

            {/* Right Column - Product Details */}
            <div className="space-y-8">
              {/* Basic Information */}
              <section className="space-y-6">
                <h2 className="text-xl font-light tracking-tight">
                  Basic Information
                </h2>

                <div>
                  <Label className="block text-sm font-medium mb-2">
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

                <div>
                  <Label className="block text-sm font-medium mb-2">
                    Brand
                  </Label>
                  <input
                    type="text"
                    placeholder="Enter brand name"
                    value={productBrand}
                    onChange={(e) => setProductBrand(e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-input focus:outline-none focus:border-foreground transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="block text-sm font-medium mb-2">
                      Price (£)
                    </Label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={productPrice}
                      onChange={(e) => setProductPrice(e.target.value)}
                      className="w-full px-4 py-3 bg-background border border-input focus:outline-none focus:border-foreground transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <Label className="block text-sm font-medium mb-2">
                      Compare at (£)
                    </Label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={productPreviousPrice}
                      onChange={(e) => setProductPreviousPrice(e.target.value)}
                      className="w-full px-4 py-3 bg-background border border-input focus:outline-none focus:border-foreground transition-colors"
                    />
                  </div>
                </div>
              </section>

              {/* Categorization */}
              <section className="space-y-4">
                <h2 className="text-xl font-light tracking-tight">
                  Organization
                </h2>

                <div>
                  <Label className="block text-sm font-medium mb-2">
                    Category
                  </Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="w-full">
                      <div className="relative flex items-center justify-between px-4 py-3 bg-background border border-input text-sm cursor-pointer text-left hover:border-foreground transition-colors">
                        <span
                          className={
                            productCategory ? "" : "text-muted-foreground"
                          }
                        >
                          {productCategory || "Select Category"}
                        </span>
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] rounded-none">
                      {Object.keys(categories).map((category) => (
                        <DropdownMenuItem
                          key={category}
                          onClick={() => {
                            setProductCategory(category);
                            setProductSubCategory("");
                          }}
                          className="flex items-center justify-between"
                        >
                          {category}
                          {productCategory === category && (
                            <Check className="h-4 w-4 text-primary" />
                          )}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div>
                  <Label className="block text-sm font-medium mb-2">
                    Subcategory
                  </Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      className="w-full"
                      disabled={!productCategory}
                    >
                      <div
                        className={`relative flex items-center justify-between px-4 py-3 bg-background border border-input text-sm cursor-pointer text-left transition-colors ${
                          !productCategory
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:border-foreground"
                        }`}
                      >
                        <span
                          className={
                            productSubCategory ? "" : "text-muted-foreground"
                          }
                        >
                          {productSubCategory || "Select Sub-Category"}
                        </span>
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] rounded-none">
                      {productCategory &&
                        categories[
                          productCategory as keyof typeof categories
                        ]?.map((subCategory) => (
                          <DropdownMenuItem
                            key={subCategory}
                            onClick={() => setProductSubCategory(subCategory)}
                            className="flex items-center justify-between"
                          >
                            {subCategory}
                            {productSubCategory === subCategory && (
                              <Check className="h-4 w-4 text-primary" />
                            )}
                          </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div>
                  <Label className="block text-sm font-medium mb-2">Type</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="w-full">
                      <div className="relative flex items-center justify-between px-4 py-3 bg-background border border-input text-sm cursor-pointer text-left hover:border-foreground transition-colors">
                        <span
                          className={productType ? "" : "text-muted-foreground"}
                        >
                          {productType || "Select Type"}
                        </span>
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] rounded-none">
                      {["Top wear", "Bottom wear", "Foot wear"].map((type) => (
                        <DropdownMenuItem
                          key={type}
                          onClick={() => setProductType(type)}
                          className="flex items-center justify-between"
                        >
                          {type}
                          {productType === type && (
                            <Check className="h-4 w-4 text-primary" />
                          )}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div>
                  <Label className="block text-sm font-medium mb-2">
                    Gender
                  </Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="w-full">
                      <div className="relative flex items-center justify-between px-4 py-3 bg-background border border-input text-sm cursor-pointer text-left hover:border-foreground transition-colors">
                        <span
                          className={productSex ? "" : "text-muted-foreground"}
                        >
                          {productSex || "Select Gender"}
                        </span>
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] rounded-none">
                      {["Female", "Male", "Unisex"].map((gender) => (
                        <DropdownMenuItem
                          key={gender}
                          onClick={() => setProductSex(gender)}
                          className="flex items-center justify-between"
                        >
                          {gender}
                          {productSex === gender && (
                            <Check className="h-4 w-4 text-primary" />
                          )}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </section>

              {/* Product Status */}
              <section className="space-y-4">
                <h2 className="text-xl font-light tracking-tight">
                  Product Status
                </h2>

                <label className="flex items-center justify-between p-4 border border-border cursor-pointer hover:bg-muted/50 transition-colors">
                  <div>
                    <p className="font-medium text-sm">Best Seller</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Feature on best sellers page
                    </p>
                  </div>
                  <Switch
                    checked={bestSeller}
                    onCheckedChange={setBestSeller}
                  />
                </label>

                <label className="flex items-center justify-between p-4 border border-border cursor-pointer hover:bg-muted/50 transition-colors">
                  <div>
                    <p className="font-medium text-sm">New Arrival</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Show as new arrival
                    </p>
                  </div>
                  <Switch
                    checked={newArrival}
                    onCheckedChange={setNewArrival}
                  />
                </label>

                <label className="flex items-center justify-between p-4 border border-border cursor-pointer hover:bg-muted/50 transition-colors">
                  <div>
                    <p className="font-medium text-sm">Available</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Product is in stock
                    </p>
                  </div>
                  <Switch
                    checked={isAvailable}
                    onCheckedChange={setIsAvailable}
                  />
                </label>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUpdateProduct;
