import React, { useState } from "react";

const AddProducts: React.FC = () => {
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productSubCategory, setProductSubCategory] = useState("");
  const [productType, setProductType] = useState("");
  const [productSize, setProductSize] = useState<string[]>([]);
  const [productPrice, setProductPrice] = useState("");
  const [productImages, setProductImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isBestseller, setIsBestseller] = useState(false);

  const handleSizeToggle = (size: string) => {
    if (productSize.includes(size)) {
      setProductSize(productSize.filter((s) => s !== size));
    } else {
      setProductSize([...productSize, size]);
    }
  };

  const handleImageChange = (index: number, file: File | null) => {
    if (file) {
      const updatedImages = [...productImages];
      const updatedPreviews = [...imagePreviews];

      updatedImages[index] = file;
      updatedPreviews[index] = URL.createObjectURL(file);

      setProductImages(updatedImages);
      setImagePreviews(updatedPreviews);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("productName", productName);
    formData.append("productDescription", productDescription);
    formData.append("productCategory", productCategory);
    formData.append("productSubCategory", productSubCategory);
    formData.append("productType", productType);
    formData.append("productPrice", productPrice);
    formData.append("isBestseller", isBestseller.toString());

    productSize.forEach((size) => {
      formData.append("productSize[]", size);
    });

    productImages.forEach((image, index) => {
      formData.append(`image${index + 1}`, image);
    });

    console.log("Form submitted");
  };

  return (
    <section className="w-full py-6">
      {/* <div className="mb-12 md:mb-10">
        <h2 className="text-4xl font-semibold mb-5">Add Product</h2>
        <p className="md:text-md">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
      </div> */}

      <form onSubmit={handleSubmit} className="space-y-8 poppins">
        {/* Image Upload */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {[0, 1, 2, 3, 4].map((index) => (
            <div key={index} className="w-full">
              <label className="flex flex-col items-center justify-center h-36 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-all">
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
        <div className="space-y-4 poppins">
          <div>
            <input
              type="text"
              placeholder="Product Name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg transition-all"
              required
            />
          </div>

          <div>
            <textarea
              placeholder="Product Description"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg transition-all"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <select
                value={productCategory}
                onChange={(e) => setProductCategory(e.target.value)}
                className="w-full p-3 border border-gray-300  transition-all"
                required
              >
                <option value=" ">Select Category</option>
                <option value="Active wear">Active Wear</option>
                <option value="Fitness accessories">Fitness Accessories</option>
              </select>
            </div>

            {productCategory === "Active wear" ? (
              <div>
                <select
                  value={productSubCategory}
                  onChange={(e) => setProductSubCategory(e.target.value)}
                  className="w-full p-3 border border-gray-300 transition-all"
                  required
                >
                  <option value="">Select Sub-Category</option>
                  <option value="Modest Workout Tops">
                    Modest Workout Tops
                  </option>
                  <option value="Joggers & Bottoms">Joggers & Bottoms</option>
                  <option value="Complete Active wear Sets">
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
              <div>
                <select
                  value={productSubCategory}
                  onChange={(e) => setProductSubCategory(e.target.value)}
                  className="w-full p-3 border border-gray-300 transition-all"
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

            <div>
              <select
                value={productType}
                onChange={(e) => setProductType(e.target.value)}
                className="w-full p-3 border border-gray-300 transition-all"
                required
              >
                <option value="">Select Product Type</option>
                <option value="Topwear">Topwear</option>
                <option value="Bottomwear">Bottomwear</option>
                <option value="Footwear">Footwear</option>
              </select>
            </div>

            <div>
              <input
                type="number"
                placeholder="Product Price"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                className="w-full p-3 border border-gray-300 transition-all"
                required
              />
            </div>
          </div>
        </div>

        {/* Sizes */}
        <div>
          <label className="text-sm font-medium">Sizes:</label>
          <div className="mt-2 flex gap-4">
            {["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"].map(
              (item, index) => (
                <div
                  className={`p-2 h-[45px] w-[45px] bg-gray-300 flex items-center justify-center cursor-pointer ${
                    productSize.includes(item)
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

        {/* Bestseller Checkbox */}
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={isBestseller}
            onChange={() => setIsBestseller(!isBestseller)}
            className="form-checkbox rounded"
          />
          <span className="ml-2 text-sm">Add to Bestseller</span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-brand-neutral text-white py-3 rounded-lg hover:bg-gray-500 transition-all poppins"
        >
          Add Product
        </button>
      </form>
    </section>
  );
};

export default AddProducts;
