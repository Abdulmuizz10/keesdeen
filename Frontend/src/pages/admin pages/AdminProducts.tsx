import React, { useEffect, useState, useRef } from "react";
import { RiDeleteBin5Line } from "react-icons/ri";
import { FaRegPenToSquare } from "react-icons/fa6";
import Axios from "axios";
import { URL } from "../../lib/constants";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { deleteProduct } from "../../context/ProductContext/ProductApiCalls";
import { formatAmountDefault } from "../../lib/utils";
import { useShop } from "../../context/ShopContext";

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const { setAdminLoader } = useShop();
  const scrollRef = useRef<any>(null);

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  // Fetch data from backend
  const fetchData = async (page: number) => {
    setLoading(true);
    try {
      const response = await Axios.get(
        `${URL}/products/page/products?page=${page}`,
        {
          withCredentials: true,
        }
      );
      setProducts(response.data.products);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (error) {
      toast.error("Error fetching products. Please refresh the page");
      setLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (confirmDelete) {
      await deleteProduct(productId, setAdminLoader);
      fetchData(currentPage);
    }
  };

  return (
    <section className="w-full" ref={scrollRef}>
      <div className="w-full bg-white p-6 rounded-lg hover:shadow-2xl transition-shadow duration-300">
        <h3 className="text-xl font-semibold mb-4">All products</h3>
        <div className="overflow-x-auto">
          <table className="w-full bg-white poppins">
            <thead className="text-sm">
              <tr className="bg-gray-100 font-extrabold">
                <th className="text-left p-4 font-semibold">Product name</th>
                <th className="text-left p-4 font-semibold">Category</th>
                <th className="text-left p-4 font-semibold">Sub-category</th>
                <th className="text-left p-4 font-semibold">Price</th>
                <th className="text-left p-4 font-semibold">Date created</th>
                <th className="text-left p-4 font-semibold">Update</th>
                <th className="text-left p-4 font-semibold">Delete</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 20 }).map((_, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-6 h-6 bg-gray-200 animate-pulse" />
                    <td className="p-4 h-6 bg-gray-200 animate-pulse" />
                    <td className="p-4 h-6 bg-gray-200 animate-pulse" />
                    <td className="p-4 h-6 bg-gray-200 animate-pulse" />
                    <td className="p-4 h-6 bg-gray-200 animate-pulse" />
                    <td className="p-4 h-6 bg-gray-200 animate-pulse" />
                    <td className="p-4 h-6 bg-gray-200 animate-pulse" />
                  </tr>
                ))
              ) : products.length > 0 ? (
                products?.map((product: any, index: number) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-gray-50 transition-colors duration-150 text-sm"
                  >
                    <Link to={`/admin/product_details/${product._id}`}>
                      <td className="p-4 line-clamp-1">{product.name}</td>
                    </Link>
                    <td className="p-4">{product.category}</td>
                    <td className="p-4">{product.subcategory}</td>
                    <td className="p-4">
                      {formatAmountDefault("GBP", product.price)}
                    </td>
                    <td className="p-4">
                      {new Date(product.createdAt).toLocaleString()}
                    </td>
                    <td className="py-2 px-8">
                      <Link to={`/admin/update_product/${product._id}`}>
                        <FaRegPenToSquare className="text-xl cursor-pointer" />
                      </Link>
                    </td>
                    <td className="py-2 px-8">
                      <RiDeleteBin5Line
                        className="text-2xl cursor-pointer"
                        onClick={() => handleDelete(product._id)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <p className="text-base sm:text-xl py-5">No products created</p>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-end mt-4 gap-3 poppins">
          <button
            className={`py-3 px-4 rounded-md bg-brand-neutral text-white ${
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={currentPage === 1}
            onClick={() => {
              setCurrentPage((prev) => Math.max(prev - 1, 1));
              scrollRef.current.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Previous
          </button>

          <button
            className={`py-3 px-4 rounded-md bg-brand-neutral text-white ${
              currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={currentPage === totalPages}
            onClick={() => {
              setCurrentPage((prev) => Math.min(prev + 1, totalPages));
              scrollRef.current.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
};

export default AdminProducts;
