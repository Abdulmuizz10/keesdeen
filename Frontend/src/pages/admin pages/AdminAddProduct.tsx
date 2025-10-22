import React, { useState } from "react";
import { createProduct } from "../../context/ProductContext/ProductApiCalls";
import { toast } from "sonner";
import { useShop } from "../../context/ShopContext";

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
];

const AdminAddProduct: React.FC = () => {
  const [productName, setProductName] = useState<string>("");
  const [productBrand, setProductBrand] = useState<string>("");
  const [productDescription, setProductDescription] = useState<string>("");
  const [productCategory, setProductCategory] = useState<string>("");
  const [productSubCategory, setProductSubCategory] = useState<string>("");
  const [productType, setProductType] = useState<string>("");
  const [productSex, setProductSex] = useState<string>("");
  const [productColors, setProductColors] = useState<string[]>([]);
  const [productPreviousPrice, setProductPreviousPrice] = useState<string>();
  const [productPrice, setProductPrice] = useState<string>();
  const [productSizes, setProductSizes] = useState<string[]>([]);
  const [productImages, setProductImages] = useState<string[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [bestSeller, setBestSeller] = useState<boolean>(false);
  const [newArrival, setNewArrival] = useState<boolean>(false);

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

  const handleImageChange = (index: number, file: File | null) => {
    if (file) {
      const updatedPreviews = [...imagePreviews];
      updatedPreviews[index] = URL.createObjectURL(file);
      setImagePreviews(updatedPreviews);

      uploadToCloudinary(file, index); // Upload image to Cloudinary
    }
  };

  const uploadToCloudinary = async (file: File, index: number) => {
    setAdminLoader(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_PRESET); // Replace with your preset
    formData.append("folder", "product_images"); // Optional: set folder in Cloudinary

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
        setAdminLoader(false);
        toast.success("Image uploaded successfully!");
        setProductImages(updatedImages.slice(0, 5));
      }
    } catch (error) {
      setAdminLoader(false);
      toast.error(`Image upload error`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      imageUrls: productImages, // Store URLs in product data
    };

    createProduct(
      formData,
      setProductName,
      setProductBrand,
      setProductDescription,
      setProductCategory,
      setProductSubCategory,
      setProductType,
      setProductSex,
      setProductColors,
      setProductPreviousPrice,
      setProductPrice,
      setProductSizes,
      setProductImages,
      setImagePreviews,
      setBestSeller,
      setNewArrival,
      setAdminLoader
    );
  };

  return (
    <section className="w-full pb-6">
      <div className="mb-12 md:mb-10">
        <h2 className="text-4xl font-semibold mb-5 text-gray-500">
          Create product
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 poppins">
        {/* Image Upload */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {[0, 1, 2, 3, 4].map((index) => (
            <div key={index} className="w-full">
              <label className="flex flex-col items-center justify-center h-36 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-all">
                <svg
                  className="w-8 h-8 mb-2 text-gray-500"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="text-xs text-gray-500">Upload image</p>
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
              {imagePreviews[index] && (
                <img
                  src={imagePreviews[index]}
                  alt={`Preview ${index + 1}`}
                  className="mt-4 w-full h-36 object-cover rounded-md"
                />
              )}
            </div>
          ))}
        </div>

        {/* Product Information */}
        <div className="space-y-4">
          <div className="flex gap-5 items-center flex-col sm:flex-row">
            <div className="w-full space-y-2">
              <label>Product name:</label>
              <input
                type="text"
                placeholder="Product Name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg transition-all focus:outline-none"
                required
              />
            </div>
            <div className="w-full space-y-2">
              <label>Product brand:</label>
              <input
                type="text"
                placeholder="Product Brand"
                value={productBrand}
                onChange={(e) => setProductBrand(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg transition-all focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label>Product description:</label>
            <textarea
              placeholder="Product Description"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg transition-all focus:outline-none"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label>Product category:</label>
              <select
                value={productCategory}
                onChange={(e) => setProductCategory(e.target.value)}
                className="w-full p-3 border border-gray-300  transition-all bg-white rounded-lg focus:outline-none"
                required
              >
                <option value=" ">Select Category</option>
                <option value="Active Wear">Active Wear</option>
                <option value="Fitness Accessories">Fitness Accessories</option>
              </select>
            </div>

            {productCategory === "Active Wear" ? (
              <div className="space-y-2">
                <label>Product sub-category:</label>
                <select
                  value={productSubCategory}
                  onChange={(e) => setProductSubCategory(e.target.value)}
                  className="w-full p-3 border border-gray-300 transition-all  bg-white rounded-lg"
                  required
                >
                  <option value="">Select Sub-Category</option>
                  <option value="Modest Workout Tops">
                    Modest Workout Tops
                  </option>
                  <option value="Joggers & Bottoms">Joggers & Bottoms</option>
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
                </select>
              </div>
            ) : (
              <div className="space-y-2">
                <label>Product category:</label>
                <select
                  value={productSubCategory}
                  onChange={(e) => setProductSubCategory(e.target.value)}
                  className="w-full p-3 border border-gray-300 transition-all  bg-white rounded-lg"
                  required
                >
                  <option value="">Select Sub-Category</option>
                  <option value="Gym Essentials Kit">Gym Essentials Kit</option>
                  <option value="Workout Bag">Workout Bag</option>
                  <option value="Water Bottle">Water Bottle</option>
                  <option value="Sweat Towel">Sweat Towel</option>
                  <option value="Athletic Socks">Athletic Socks</option>
                </select>
              </div>
            )}

            <div className="space-y-2">
              <label>Product type:</label>
              <select
                value={productType}
                onChange={(e) => setProductType(e.target.value)}
                className="w-full p-3 border border-gray-300 transition-all bg-white rounded-lg"
              >
                <option value="">Select Product Type</option>
                <option value="Top wear">Top Wear</option>
                <option value="Bottom wear">Bottom Wear</option>
                <option value="Foot wear">Foot Wear</option>
              </select>
            </div>

            <div className="space-y-2">
              <label>Product sex:</label>
              <select
                value={productSex}
                onChange={(e) => setProductSex(e.target.value)}
                className="w-full p-3 border border-gray-300 transition-all bg-white rounded-lg"
              >
                <option value="">Select Product Sex</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Unisex">Unisex</option>
              </select>
            </div>

            <div className="space-y-2">
              <label>Product previous price:</label>
              <input
                type="number"
                placeholder="Product Previous Price Optional"
                value={productPreviousPrice}
                onChange={(e) => setProductPreviousPrice(e.target.value)}
                className="w-full p-3 border border-gray-300 transition-all rounded-lg focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label>Product price:</label>
              <input
                type="number"
                placeholder="Product Price"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                className="w-full p-3 border border-gray-300 transition-all rounded-lg focus:outline-none"
                required
              />
            </div>
          </div>
        </div>

        {/* Colors */}
        <div>
          <label>Colors:</label>
          <div className="mt-2 grid grid-cols-3 md:grid-cols-5 xl:grid-cols-7 gap-5">
            {popularColors.map((item, index) => (
              <div className="flex flex-col justify-center items-center">
                <p
                  className={`mb-1 ${
                    productColors.includes(item.name) && "font-bold text-black"
                  }`}
                >
                  {item.name}
                </p>
                <div
                  key={index}
                  className={`p-2 h-[45px] w-[45px] rounded-full cursor-pointer flex items-center justify-center border-[3px] transition-all duration-300 ease-in-out ${
                    productColors.includes(item.name) &&
                    "border-white !w-[10px] !h-[10px]"
                  }`}
                  style={{ backgroundColor: item.code }}
                  onClick={() => handleColorToggle(item.name)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Sizes */}
        <div>
          <label>Sizes:</label>
          <div className="mt-2 flex gap-4 flex-wrap">
            {["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"].map(
              (item, index) => (
                <div
                  className={`p-2 h-[45px] w-[45px] bg-gray-300 flex items-center justify-center cursor-pointer ${
                    productSizes.includes(item)
                      ? "border-2 border-border-primary"
                      : ""
                  }`}
                  key={index}
                  onClick={() => handleSizeToggle(item)}
                >
                  {item}
                </div>
              )
            )}
          </div>
        </div>

        <div className="flex items-center gap-10">
          {/* Bestseller Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={bestSeller}
              onChange={() => setBestSeller(!bestSeller)}
              className="form-checkbox rounded h-4 w-4"
            />
            <span className="ml-2 text-sm">Add to Best sellers</span>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={newArrival}
              onChange={() => setNewArrival(!newArrival)}
              className="form-checkbox rounded h-4 w-4"
            />
            <span className="ml-2 text-sm">Add to New Arrivals</span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-brand-neutral text-white py-3 rounded-lg hover:bg-gray-700 transition-all poppins"
        >
          Add product
        </button>
      </form>
    </section>
  );
};

export default AdminAddProduct;
