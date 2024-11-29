import React, { useEffect, useState } from "react";
import { RiDeleteBin5Line } from "react-icons/ri";
import { FaRegPenToSquare } from "react-icons/fa6";
import { formatAmount } from "../../lib/utils";
import { deleteProduct } from "../../context/ProductContext/ProductApiCalls";
import { useProducts } from "../../context/ProductContext/ProductContext";
import { Product } from "../../lib/types";
import Axios from "axios";
import { URL } from "../../lib/constants";
import { Link } from "react-router-dom";

const AdminProducts: React.FC = () => {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const { dispatch } = useProducts();

  // Fetch data from backend
  const fetchData = async (page: number) => {
    setLoading(true);
    try {
      const userToken = JSON.parse(localStorage.getItem("user") || "{}").token;
      const response = await Axios.get(
        `${URL}/products/page/products?page=${page}`,
        {
          headers: {
            token: "Bearer " + userToken,
          },
        }
      );
      setLoading(false);
      setItems(response.data.products);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const handleDelete = async (productId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (confirmDelete) {
      try {
        await deleteProduct(productId, dispatch); // Deleting product
        // Re-fetch products after deletion to ensure consistency
        fetchData(currentPage);
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  return (
    <div className="w-full">
      <div className="w-full bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
        <h3 className="text-xl font-semibold mb-4">Product List</h3>
        <div className="overflow-x-auto">
          <table className="w-full bg-white poppins">
            <thead className="text-sm">
              <tr className="bg-gray-100 rounded-t-xl font-extrabold">
                <th className="text-left p-4 font-semibold rounded-tl-xl">
                  Product name
                </th>
                <th className="text-left p-4 font-semibold">Category</th>
                <th className="text-left p-4 font-semibold">Sub-Category</th>
                <th className="text-left p-4 font-semibold">Price</th>
                <th className="text-left p-4 font-semibold">Date Added</th>
                <th className="text-left p-4 font-semibold">Update</th>
                <th className="text-left p-4 font-semibold rounded-tr-xl">
                  Delete
                </th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 20 }).map((_, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-6 h-6 bg-gray-200 animate-pulse" />
                      <td className="p-4 h-6 bg-gray-200 animate-pulse" />
                      <td className="p-4 h-6 bg-gray-200 animate-pulse" />
                      <td className="p-4 h-6 bg-gray-200 animate-pulse" />
                      <td className="p-4 h-6 bg-gray-200 animate-pulse" />
                      <td className="p-4 h-6 bg-gray-200 animate-pulse" />
                      <td className="p-4 h-6 bg-gray-200 animate-pulse" />
                      <td className="p-4 h-6 bg-gray-200 animate-pulse" />
                    </tr>
                  ))
                : items?.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="p-4 text-[15px] line-clamp-1">
                        {item.name}
                      </td>
                      <td className="p-4 text-sm">{item.category}</td>
                      <td className="p-4 text-sm">{item.subcategory}</td>
                      <td className="p-4 text-sm">
                        {formatAmount(item.price)}
                      </td>
                      <td className="p-4 text-base font-medium">
                        {item.createdAt?.split("").slice(0, 10)}
                      </td>
                      <td className="py-2 px-8">
                        <Link to={`/admin/update_product/${item._id}`}>
                          <FaRegPenToSquare className="text-xl cursor-pointer" />
                        </Link>
                      </td>
                      <td className="py-2 px-8">
                        <RiDeleteBin5Line
                          className="text-2xl cursor-pointer"
                          onClick={() => handleDelete(item._id)}
                        />
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-end mt-4 gap-3">
          <button
            className={`py-3 px-4 rounded-md bg-brand-neutral text-white ${
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            Previous
          </button>

          <button
            className={`py-3 px-4 rounded-md bg-brand-neutral text-white ${
              currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
