import React, { useEffect, useRef, useState } from "react";
import Axios from "axios";
import { URL } from "../../lib/constants";
import { RiDeleteBin5Line } from "react-icons/ri";
import { toast } from "sonner";
import { FaRegCopy } from "react-icons/fa";
import { useShop } from "../../context/ShopContext";
import { Link } from "react-router-dom";

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<any>([]);
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
      const response = await Axios.get(`${URL}/users/page/users?page=${page}`, {
        withCredentials: true,
      });
      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (error) {
      toast.error("Error getting users!");
      setLoading(false);
    }
  };

  const handleDelete = async (userId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (confirmDelete) {
      setAdminLoader(true);
      try {
        await Axios.delete(`${URL}/users/${userId}`, {
          withCredentials: true,
        });
        toast.success("User deleted successfully!");
        setAdminLoader(false);
        fetchData(currentPage);
      } catch (error) {
        setAdminLoader(false);
        toast.error("Error while deleting the user!");
      }
    }
  };

  const copyId = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast("User ID copied to clipboard!");
      })
      .catch(() => {
        toast("Failed to copy transaction ID.");
      });
  };

  return (
    <div className="w-full" ref={scrollRef}>
      <div className="w-full bg-white p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">All users</h3>
        <div className="overflow-x-auto">
          <table className="w-full bg-white poppins">
            <thead className="text-sm">
              <tr className="bg-gray-100 font-extrabold">
                <th className="text-left p-4 font-semibold">SN</th>
                <th className="text-left p-4 font-semibold">User ID</th>
                <th className="text-left p-4 font-semibold">Username</th>
                <th className="text-left p-4 font-semibold">Email address</th>
                <th className="text-left p-4 font-semibold">Admin</th>
                <th className="text-left p-4 font-semibold">Date signed up</th>
                <th className="text-left p-4 font-semibold">Delete</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 20 }).map((_, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-6 h-6 bg-gray-200 animate-pulse" />
                    <td className="p-6 h-6 bg-gray-200 animate-pulse" />
                    <td className="p-4 h-6 bg-gray-200 animate-pulse" />
                    <td className="p-4 h-6 bg-gray-200 animate-pulse" />
                    <td className="p-4 h-6 bg-gray-200 animate-pulse" />
                    <td className="p-4 h-6 bg-gray-200 animate-pulse" />
                    <td className="p-4 h-6 bg-gray-200 animate-pulse" />
                  </tr>
                ))
              ) : users.length > 0 ? (
                users?.map((user: any, index: number) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-gray-50 transition-colors duration-150 text-sm"
                  >
                    <td className="p-4">{index + 1}</td>
                    <td className="p-4 flex gap-1 items-center">
                      {user._id.split("").slice(0, 5)}...
                      <FaRegCopy
                        className="text-xl cursor-pointer"
                        onClick={() => copyId(user._id)}
                      />
                    </td>
                    <td className="p-4">
                      <Link to={`/admin/user_details/${user._id}`}>
                        {`${user.firstName} ${user.lastName}`}
                      </Link>
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
                      {new Date(user?.createdAt).toLocaleString()}
                    </td>
                    <td className="py-2 px-8">
                      <RiDeleteBin5Line
                        className="text-2xl cursor-pointer"
                        onClick={() => handleDelete(user._id)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <p className="text-base sm:text-xl py-5">No Users available</p>
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
    </div>
  );
};

export default AdminUsers;
