import Axios from "axios";
import React, { useEffect, useState } from "react";
import { URL } from "../../lib/constants";
import { toast } from "sonner";
import { FaRegCopy } from "react-icons/fa";
import Spinner from "../../components/Spinner";

const AdminSubscribers: React.FC = () => {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await Axios.get(`${URL}/subscribers/all-subscribers`, {
          withCredentials: true,
        });
        setSubscribers(response.data);
        setLoading(false);
      } catch (error) {
        toast.error("Error fetching subscribers. Please refresh the page.");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const copyId = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast("Subscriber email copied to clipboard!");
      })
      .catch(() => {
        toast("Failed to copy subscriber email.");
      });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white rounded-lg">
        <Spinner />
      </div>
    );
  }

  return (
    <section className="w-full">
      <div className="w-full max-w-7xl mx-auto bg-white p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-6">All subscribers</h3>
        {subscribers?.length > 0 ? (
          <table className="w-full bg-white poppins">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-4 border-b border-gray-300">SN</th>
                <th className="text-left p-4 border-b border-gray-300">
                  Email
                </th>
                <th className="text-left p-4 border-b border-gray-300">Date</th>

                <th className="text-left p-4 border-b border-gray-300">Time</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((subscriber, index) => (
                <tr
                  key={subscriber._id}
                  className="hover:bg-gray-50 transition-colors border-b"
                >
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4 flex items-center gap-3">
                    {subscriber.email}

                    <FaRegCopy
                      className="text-xl cursor-pointer"
                      onClick={() => copyId(subscriber.email)}
                    />
                  </td>
                  <td className="p-4">
                    {new Date(subscriber.createdAt).toLocaleString()}
                  </td>

                  <td className="p-4">
                    {
                      new Date(subscriber.createdAt)
                        .toLocaleString()
                        .split(",")[1]
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center text-gray-500">No subscribers found.</div>
        )}
      </div>
    </section>
  );
};

export default AdminSubscribers;
