import React, { useEffect, useRef, useState } from "react";
import { Chart, ArcElement } from "chart.js";
import { formatAmount } from "../../lib/utils";
import Axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { URL } from "../../lib/constants";

Chart.register(ArcElement);

const AdminBestSellers: React.FC = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState<Boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const scrollRef = useRef<any>(null);

  const fetchData = async (page: number) => {
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
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
      setProducts(response.data.products);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
    window.scrollTo(0, 0);
  }, [currentPage]);

  const handleStatusChange = async (productId: any, status: string) => {
    setLoading(true);
    try {
      const userToken = JSON.parse(localStorage.getItem("user") || "{}").token;
      const response = await Axios.patch(
        `${URL}/products/update/${productId}/best-seller`,
        { status },
        {
          headers: {
            token: "Bearer " + userToken,
          },
          validateStatus: (status: any) => status < 600,
        }
      );
      if (response.status === 200) {
        setLoading(false);
        fetchData(currentPage);
        toast.success(response.data.message);
      } else {
        setLoading(false);
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (error) {
      setLoading(false);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <section className="w-full" ref={scrollRef}>
      <div className="w-full">
        {/* Latest Orders */}
        <div className="w-full bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
          <h3 className="text-xl font-semibold mb-4">
            Update products to best sellers
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full bg-white poppins">
              <thead className="text-sm">
                <tr className="bg-gray-100 font-extrabold">
                  <th className="text-left p-4 font-semibold">Product name</th>
                  <th className="text-left p-4 font-semibold">Category</th>
                  <th className="text-left p-4 font-semibold">Price</th>
                  <th className="text-left p-4 font-semibold">Best seller</th>
                  <th className="text-left p-4 font-semibold">
                    Update to best seller
                  </th>
                  <th className="text-left p-4 font-semibold pl-12">
                    Date created
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
                      </tr>
                    ))
                  : products?.map((product: any, index: number) => (
                      <tr
                        key={index}
                        className="border-b hover:bg-gray-50 transition-colors duration-150 text-sm"
                      >
                        <Link to={`/admin/product_details/${product._id}`}>
                          <td className="p-4 line-clamp-1">{product.name}</td>
                        </Link>
                        <td className="p-4">{product.category}</td>
                        <td className="p-4">{formatAmount(product.price)}</td>
                        <td className="p-4">
                          {product.bestSeller ? (
                            <p className="text-green-500 font-semibold pl-4">
                              True
                            </p>
                          ) : (
                            <p className="text-brand-secondary font-semibold pl-4">
                              False
                            </p>
                          )}
                        </td>
                        <td className="p-4">
                          <select
                            onChange={(e) =>
                              handleStatusChange(product._id, e.target.value)
                            }
                            className="border border-gray-300  p-1 focus:ring-none"
                          >
                            <option value="">Select status</option>
                            <option value={"isBestSeller"}>Yes</option>
                            <option value={"notBestSeller"}>No</option>
                          </select>
                        </td>
                        <td className="p-5">
                          {product.createdAt.split("").slice(0, 10)} at{" "}
                          {product.createdAt.split("").slice(11, 19)}
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>

          {/* Pagination controls */}

          <div className="flex justify-end mt-4 gap-3 poppins">
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
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : ""
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
    </section>
  );
};

export default AdminBestSellers;
