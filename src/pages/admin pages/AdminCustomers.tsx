import React, { useEffect, useState } from "react";
import Axios from "axios";
import { URL } from "../../lib/constants";
import { RiDeleteBin5Line } from "react-icons/ri";
import { toast } from "react-toastify";

const AdminCustomers: React.FC = () => {
  const [customers, setCustomers] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);

  // Fetch data from backend
  const fetchData = async (page: number) => {
    setLoading(true);
    try {
      const userToken = JSON.parse(localStorage.getItem("user") || "{}").token;
      const response = await Axios.get(`${URL}/users/page/users?page=${page}`, {
        headers: {
          token: "Bearer " + userToken,
        },
      });
      setLoading(false);
      setCustomers(response.data.users);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      toast.error("Error fetching products!");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const handleDelete = async (productId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (confirmDelete) {
      try {
        await Axios.delete(`${URL}/users/${productId}`, {
          headers: {
            token:
              "Bearer " +
              JSON.parse(localStorage.getItem("user") || "{}").token,
          },
        });
        toast.success("User deleted successfully!");
        fetchData(currentPage);
      } catch (error) {
        toast.error("Error while deleting the user!");
      }
    }
  };

  return (
    <div className="w-full">
      <div className="w-full bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
        <h3 className="text-xl font-semibold mb-4">Customer List</h3>
        <div className="overflow-x-auto">
          <table className="w-full bg-white poppins">
            <thead className="text-sm">
              <tr className="bg-gray-100 font-extrabold">
                <th className="text-left p-4 font-semibold rounded-tl-xl">
                  User ID
                </th>
                <th className="text-left p-4 font-semibold">Username</th>
                <th className="text-left p-4 font-semibold">Email</th>
                <th className="text-left p-4 font-semibold">Date Added</th>
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
                    </tr>
                  ))
                : customers?.map((item: any, index: number) => (
                    <tr
                      key={index}
                      className="border-b hover:bg-gray-50 transition-colors duration-150 text-sm"
                    >
                      <td className="p-4">
                        {item._id.split("").slice(0, 10)}...
                      </td>
                      <td className="p-4 line-clamp-1">
                        {`${item.firstName} ${item.lastName}`}
                      </td>
                      <td className="p-4">
                        {item.email.length > 20
                          ? item.email.split("").slice(0, 15)
                          : item.email}
                      </td>
                      <td className="p-4">
                        {new Date(item.createdAt).toLocaleDateString()}
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

export default AdminCustomers;
