import React from "react";

const AdminProducts: React.FC = () => {
  // Sample data for products
  const products = [
    {
      name: "Men's T-Shirt",
      category: "Clothing",
      price: 25.99,
      isAvailable: true,
      date: "01.01.2024",
    },
    {
      name: "Women's Jacket",
      category: "Clothing",
      price: 49.99,
      isAvailable: false,
      date: "12.12.2023",
    },
    {
      name: "Sneakers",
      category: "Footwear",
      price: 79.99,
      isAvailable: true,
      date: "15.11.2023",
    },
    {
      name: "Leather Handbag",
      category: "Accessories",
      price: 120.0,
      isAvailable: true,
      date: "18.10.2023",
    },
    {
      name: "Wool Scarf",
      category: "Accessories",
      price: 19.99,
      isAvailable: false,
      date: "25.09.2023",
    },
  ];

  return (
    <div className="w-full">
      {/* Product List */}
      <div className="w-full bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
        <h3 className="text-xl font-semibold mb-4">Product List</h3>

        <div className="overflow-x-auto">
          <table className="w-full bg-white">
            <thead>
              <tr className="bg-gray-100 rounded-t-xl font-extrabold">
                <th className="text-left p-4 font-semibold first:rounded-tl-xl last:rounded-tr-xl">
                  Product
                </th>
                <th className="text-left p-4 font-semibold">Category</th>
                <th className="text-left p-4 font-semibold">Price</th>
                <th className="text-left p-4 font-semibold">Availability</th>
                <th className="text-left p-4 font-semibold rounded-tr-xl">
                  Date Added
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="flex items-center space-x-4 p-4">
                    <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
                    <span className="font-semibold">{product.name}</span>
                  </td>
                  <td className="p-4 text-sm">{product.category}</td>
                  <td className="p-4 text-sm">${product.price.toFixed(2)}</td>
                  <td className="p-4">
                    <span
                      className={`px-4 py-1 rounded-full text-sm ${
                        product.isAvailable
                          ? "bg-green-200 text-green-800"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {product.isAvailable ? "Available" : "Out of Stock"}
                    </span>
                  </td>
                  <td className="p-4 text-sm">{product.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
