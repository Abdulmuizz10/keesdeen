import React, { useState } from "react";
import axios from "axios";
import { URL } from "../../lib/constants";
import { toast } from "sonner";
import { useShop } from "../../context/ShopContext";

const AdminSendEmailToSubscribers: React.FC = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { setAdminLoader } = useShop();

  const handleSendEmail = async () => {
    if (!subject || !message) {
      toast.error("Subject and message are required!");
      return;
    }
    setAdminLoader(true);
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${URL}/subscribers/send-email`,
        {
          subject,
          message,
        },
        {
          withCredentials: true,
        }
      );
      toast.success(response.data.message);
      setSubject("");
      setMessage("");
    } catch (error) {
      toast.error("Failed to send emails.");
    } finally {
      setIsLoading(false);
      setAdminLoader(false);
    }
  };

  return (
    <section className="w-full">
      <div className="w-full bg-white p-6 rounded-lg hover:shadow-2xl transition-shadow duration-300">
        <h3 className="text-xl font-semibold mb-4">
          Send email to subscribers
        </h3>

        <div className="poppins">
          <div className="mb-4">
            <label className="block text-base font-medium mb-4">Subject:</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="border rounded w-full px-3 py-2 outline-none"
            />
          </div>
          <div className="mb-4">
            <label className="block text-base font-medium mb-4">Message:</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="border rounded w-full px-3 py-2 outline-none"
              rows={15}
            ></textarea>
          </div>
          <button
            onClick={handleSendEmail}
            className="bg-brand-neutral text-white rounded-md py-3 px-18 w-full text-base poppins"
            disabled={isLoading}
          >
            {isLoading ? "Sending email..." : "Send Email"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default AdminSendEmailToSubscribers;
