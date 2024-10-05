import React, { useState } from "react";

// // import {
// //   // Button,
// //   Select,
// //   SelectContent,
// //   SelectItem,
// //   SelectTrigger,
// //   SelectValue,
// // } from "@relume_io/relume-ui";

const AddProducts: React.FC = () => {
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productSubCategory, setProductSubCategory] = useState("");
  const [productSize, setProductSize] = useState<string[]>([]);
  //   const [productColor, setProductColor] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productImages, setProductImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isBestseller, setIsBestseller] = useState(false);

  const handleSizeChange = (size: string) => {
    setProductSize((prevSizes) =>
      prevSizes.includes(size)
        ? prevSizes.filter((s) => s !== size)
        : [...prevSizes, size]
    );
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
    formData.append("productPrice", productPrice);
    formData.append("isBestseller", isBestseller.toString());

    // Append the selected sizes
    productSize.forEach((size) => {
      formData.append("productSize[]", size);
    });

    // Append the images
    productImages.forEach((image, index) => {
      formData.append(`image${index + 1}`, image);
    });

    // You can submit the formData to your backend API here
    console.log("Form submitted");
  };

  if (productCategory) {
    console.log(productCategory);
  }
  return (
    <section className="w-full">
      <h2 className=" mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl bricolage-grotesque">
        Add Product
      </h2>

      <form onSubmit={handleSubmit} className="space-y-10 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {[0, 1, 2, 3].map((index) => (
            <div key={index} className="w-full">
              <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-white dark:bg-gray-800 hover:bg-gray-50 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-700">
                <div className="flex flex-col items-center pt-2 pb-3">
                  <svg
                    className="w-10 h-10 mb-3 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
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
                  <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    SVG, PNG, JPG, or GIF
                  </p>
                </div>
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
                  required
                />
              </label>
              {imagePreviews[index] && (
                <img
                  src={imagePreviews[index]}
                  alt={`Preview ${index + 1}`}
                  className="mt-4 w-full h-36 object-cover rounded-lg"
                />
              )}
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Product Name
            </label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="mt-2 p-3 block w-full border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Product Description
            </label>
            <textarea
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              className="mt-2 p-3 block w-full border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              rows={4}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Product Category
            </label>
            <select
              value={productCategory}
              onChange={(e) => setProductCategory(e.target.value)}
              className="mt-2 p-3 block w-full border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              required
            >
              <option value="">Select category</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Sub Category
            </label>
            <select
              value={productSubCategory}
              onChange={(e) => setProductSubCategory(e.target.value)}
              className="mt-2 p-3 block w-full border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              required
            >
              <option value="">Select sub-category</option>
              <option value="Topwear">Topwear</option>
              <option value="Bottomwear">Bottomwear</option>
              <option value="Footwear">Footwear</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Product Price
            </label>
            <input
              type="number"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
              className="mt-2 p-3 block w-full border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Product Sizes
          </label>
          <div className="mt-4 flex flex-wrap gap-4">
            {["S", "M", "L", "XL", "XXL"].map((size) => (
              <label key={size} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={productSize.includes(size)}
                  onChange={() => handleSizeChange(size)}
                  className="form-checkbox rounded text-indigo-600 dark:bg-gray-800 dark:border-gray-600"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {size}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={isBestseller}
            onChange={() => setIsBestseller(!isBestseller)}
            className="form-checkbox rounded text-indigo-600 dark:bg-gray-800 dark:border-gray-600"
          />
          <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
            Add to bestseller
          </span>
        </div>

        {/* <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          ></button> */}

        <button
          type="submit"
          className="w-full bg-black text-white p-2 rounded-md hover:bg-gray-800"
        >
          Add Product
        </button>
      </form>
    </section>
  );
};

export default AddProducts;
