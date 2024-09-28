// import React, { useState } from "react";

// const AddProducts: React.FC = () => {
//   const [productName, setProductName] = useState("");
//   const [productDescription, setProductDescription] = useState("");
//   const [productCategory, setProductCategory] = useState("");
//   const [productSubCategory, setProductSubCategory] = useState("");
//   const [productSize, setProductSize] = useState<string[]>([]);
//   const [productColor, setProductColor] = useState("");
//   const [productPrice, setProductPrice] = useState("");
//   const [productImages, setProductImages] = useState<File[]>([]);
//   const [isBestseller, setIsBestseller] = useState(false);

//   const handleSizeChange = (size: string) => {
//     setProductSize((prevSizes) =>
//       prevSizes.includes(size)
//         ? prevSizes.filter((s) => s !== size)
//         : [...prevSizes, size]
//     );
//   };

//   const handleImageChange = (index: number, file: File | null) => {
//     if (file) {
//       const updatedImages = [...productImages];
//       updatedImages[index] = file;
//       setProductImages(updatedImages);
//     }
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append("productName", productName);
//     formData.append("productDescription", productDescription);
//     formData.append("productCategory", productCategory);
//     formData.append("productSubCategory", productSubCategory);
//     formData.append("productPrice", productPrice);
//     formData.append("isBestseller", isBestseller.toString());

//     // Append the selected sizes
//     productSize.forEach((size) => {
//       formData.append("productSize[]", size);
//     });

//     // Append the images
//     productImages.forEach((image, index) => {
//       formData.append(`image${index + 1}`, image);
//     });

//     // You can submit the formData to your backend API here
//     console.log("Form submitted");

//     // Example of how to send formData to a server using fetch
//     // fetch('/api/upload', {
//     //   method: 'POST',
//     //   body: formData,
//     // }).then(response => response.json()).then(data => console.log(data));
//   };

//   if (productImages.length > 0) {
//     console.log(productImages);
//   }
//   return (
//     <div className="p-8 max-w-2xl mx-auto">
//       <h2 className="text-2xl font-bold mb-6">Add Product</h2>
//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div className="grid md:grid-cols-3 xl:grid-cols-4 gap-4">
//           {[0, 1, 2, 3].map((index) => (
//             <div className="flex items-center justify-center w-full">
//               <label className="flex flex-col items-center justify-center w-full py-3 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
//                 <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                   <svg
//                     className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
//                     aria-hidden="true"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 20 16"
//                   >
//                     <path
//                       stroke="currentColor"
//                       stroke-linecap="round"
//                       stroke-linejoin="round"
//                       stroke-width="2"
//                       d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
//                     />
//                   </svg>
//                   <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
//                     <span className="font-semibold">Click to upload</span>
//                   </p>
//                   <p className="text-xs text-gray-500 dark:text-gray-400">
//                     SVG, PNG, JPG or GIF
//                   </p>
//                 </div>
//                 {/* <input id="dropzone-file" type="file" className="hidden" /> */}
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={(e) =>
//                     handleImageChange(
//                       index,
//                       e.target.files ? e.target.files[0] : null
//                     )
//                   }
//                   // className="p-1 w-full border border-gray-300 rounded-md"
//                   className="hidden"
//                   required
//                 />
//               </label>
//             </div>
//           ))}
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700">
//             Product Name
//           </label>
//           <input
//             type="text"
//             value={productName}
//             onChange={(e) => setProductName(e.target.value)}
//             className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
//             required
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700">
//             Product Description
//           </label>
//           <textarea
//             value={productDescription}
//             onChange={(e) => setProductDescription(e.target.value)}
//             className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
//             required
//           />
//         </div>

//         <div className="grid grid-cols-3 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Product Category
//             </label>
//             <select
//               value={productCategory}
//               onChange={(e) => setProductCategory(e.target.value)}
//               className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
//               required
//             >
//               <option value="">Select category</option>
//               <option value="Men">Men</option>
//               <option value="Women">Women</option>
//               <option value="Kids">Kids</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Sub Category
//             </label>
//             <select
//               value={productSubCategory}
//               onChange={(e) => setProductSubCategory(e.target.value)}
//               className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
//               required
//             >
//               <option value="">Select sub-category</option>
//               <option value="Topwear">Topwear</option>
//               <option value="Bottomwear">Bottomwear</option>
//               <option value="Footwear">Footwear</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Product Price
//             </label>
//             <input
//               type="number"
//               value={productPrice}
//               onChange={(e) => setProductPrice(e.target.value)}
//               className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
//               required
//             />
//           </div>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700">
//             Product Sizes
//           </label>
//           <div className="mt-2 flex space-x-4">
//             {["S", "M", "L", "XL", "XXL"].map((size) => (
//               <label key={size} className="flex items-center">
//                 <input
//                   type="checkbox"
//                   checked={productSize.includes(size)}
//                   onChange={() => handleSizeChange(size)}
//                   className="form-checkbox"
//                 />
//                 <span className="ml-2">{size}</span>
//               </label>
//             ))}
//           </div>
//         </div>

//         <div className="flex items-center">
//           <input
//             type="checkbox"
//             checked={isBestseller}
//             onChange={() => setIsBestseller(!isBestseller)}
//             className="form-checkbox"
//           />
//           <span className="ml-2">Add to bestseller</span>
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-black text-white p-2 rounded-md hover:bg-gray-800"
//         >
//           ADD
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AddProducts;

import React, { useState } from "react";

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

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Add Product</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-3 xl:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((index) => (
            <div key={index} className="flex flex-col items-center w-full">
              <label className="flex flex-col items-center justify-center w-full py-3 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
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
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
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

              {/* Display image preview if available */}
              {imagePreviews[index] && (
                <img
                  src={imagePreviews[index]}
                  alt={`Preview ${index + 1}`}
                  className="mt-4 w-full h-full object-cover rounded-md"
                />
              )}
            </div>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Product Name
          </label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Product Description
          </label>
          <textarea
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Product Category
            </label>
            <select
              value={productCategory}
              onChange={(e) => setProductCategory(e.target.value)}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            >
              <option value="">Select category</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Sub Category
            </label>
            <select
              value={productSubCategory}
              onChange={(e) => setProductSubCategory(e.target.value)}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            >
              <option value="">Select sub-category</option>
              <option value="Topwear">Topwear</option>
              <option value="Bottomwear">Bottomwear</option>
              <option value="Footwear">Footwear</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Product Price
            </label>
            <input
              type="number"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Product Sizes
          </label>
          <div className="mt-2 flex space-x-4">
            {["S", "M", "L", "XL", "XXL"].map((size) => (
              <label key={size} className="flex items-center">
                <input
                  type="checkbox"
                  checked={productSize.includes(size)}
                  onChange={() => handleSizeChange(size)}
                  className="form-checkbox"
                />
                <span className="ml-2">{size}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={isBestseller}
            onChange={() => setIsBestseller(!isBestseller)}
            className="form-checkbox"
          />
          <span className="ml-2">Add to bestseller</span>
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white p-2 rounded-md hover:bg-gray-800"
        >
          ADD
        </button>
      </form>
    </div>
  );
};

export default AddProducts;
