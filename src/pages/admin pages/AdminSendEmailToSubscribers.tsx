import React, { useState } from "react";
import axios from "axios";
import { URL } from "../../lib/constants";
import { toast } from "react-toastify";

const AdminSendEmailToSubscribers: React.FC = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Track loading state

  const handleSendEmail = async () => {
    if (!subject || !message) {
      toast.error("Subject and message are required!");
      return;
    }
    setIsLoading(true); // Set loading to true when the request starts
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
      setIsLoading(false); // Set loading to false once the request completes
    }
  };

  return (
    <section className="w-full">
      <div className="w-full bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
        <h3 className="text-xl font-semibold mb-4">
          Send email to subscribers
        </h3>

        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-4">Subject:</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="border rounded w-full px-3 py-2 poppins"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-4">Message:</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="border rounded w-full px-3 py-2 ring-0 poppins"
              rows={15}
            ></textarea>
          </div>
          <button
            onClick={handleSendEmail}
            className="bg-brand-neutral text-white rounded-md py-4 px-18 max-sm:w-full text-base poppins"
            disabled={isLoading} // Disable button during loading
          >
            {isLoading ? (
              <span className="animate-spin">Sending...</span> // Display loading text or spinner
            ) : (
              "Send Email"
            )}
          </button>
        </div>
      </div>
    </section>
  );
};

export default AdminSendEmailToSubscribers;
