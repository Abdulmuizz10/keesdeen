import React, { useEffect, useRef, useState } from "react";
import Axios from "axios";
import { URL } from "../../lib/constants";
import { RiDeleteBin5Line } from "react-icons/ri";
import { toast } from "react-toastify";

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const scrollRef = useRef<any>(null);

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  // Fetch data from backend
  const fetchData = async (page: number) => {
    try {
      const userToken = JSON.parse(localStorage.getItem("user") || "{}").token;
      const response = await Axios.get(`${URL}/users/page/users?page=${page}`, {
        headers: {
          token: "Bearer " + userToken,
        },
      });
      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (error) {
      toast.error("Error fetching users!");
      setLoading(false);
    }
  };

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
                <th className="text-left p-4 font-semibold">User ID</th>
                <th className="text-left p-4 font-semibold">Username</th>
                <th className="text-left p-4 font-semibold">Email address</th>
                <th className="text-left p-4 font-semibold">Admin</th>
                <th className="text-left p-4 font-semibold">Date added</th>
                <th className="text-left p-4 font-semibold">Delete</th>
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
                : users?.map((user: any, index: number) => (
                    <tr
                      key={index}
                      className="border-b hover:bg-gray-50 transition-colors duration-150 text-sm"
                    >
                      <td className="p-4">
                        {user._id.split("").slice(0, 15)}...
                      </td>
                      <td className="p-4 line-clamp-1">
                        {`${user.firstName} ${user.lastName}`}
                      </td>
                      <td className="p-4">{user.email}</td>
                      <td className="p-4">
                        {user.isAdmin ? (
                          <span className="text-green-500 font-semibold">
                            True
                          </span>
                        ) : (
                          <span className="text-brand-secondary font-semibold">
                            False
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        {user.createdAt?.split("").slice(0, 10)} at{" "}
                        {user.createdAt?.split("").slice(11, 19)}
                      </td>
                      <td className="py-2 px-8">
                        <RiDeleteBin5Line
                          className="text-2xl cursor-pointer"
                          onClick={() => handleDelete(user._id)}
                        />
                      </td>
                    </tr>
                  ))}
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
    </div>
  );
};

export default AdminUsers;
