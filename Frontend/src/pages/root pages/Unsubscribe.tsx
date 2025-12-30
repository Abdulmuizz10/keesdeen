import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Mail, CheckCircle, XCircle } from "lucide-react";
import Spinner from "@/components/Spinner";
import axiosInstance from "@/lib/axiosConfig";

const Unsubscribe: React.FC = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "success" | "error" | "already"
  >("idle");
  const [message, setMessage] = useState("");

  const handleUnsubscribe = async () => {
    if (!token) {
      toast.error("Invalid unsubscribe link");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post(
        `/subscribers/unsubscribe/${token}`,
        {},
        {
          validateStatus: (status: any) => status < 600,
        }
      );

      if (response.status === 200) {
        setMessage(response.data.message || "Successfully unsubscribed");
        if (response.data.message === "You're already unsubscribed") {
          setStatus("already");
          toast.info("You're already unsubscribed");
        } else {
          setStatus("success");
          toast.success("Successfully unsubscribed");
        }
        navigate("/");
      } else {
        setStatus("error");
        setMessage(response.data.message || "Failed to unsubscribe");
        toast.error(response.data.message || "Failed to unsubscribe");
      }
    } catch (error: any) {
      setStatus("error");
      const errorMessage =
        error.response?.data?.message || "An error occurred. Please try again.";
      setMessage(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 flex h-screen w-screen items-center justify-center bg-black/50">
          <Spinner />
        </div>
      )}
      {/* Content Section */}
      <div className="w-full max-w-sm px-8">
        {status === "idle" && (
          <>
            {/* Header */}
            <div className="mb-12 text-center">
              <div className="mb-6 flex justify-center">
                <Mail className="h-16 w-16 text-gray-400" strokeWidth={1} />
              </div>
              <h1 className="mb-3 text-2xl font-light tracking-tight md:text-3xl">
                Unsubscribe
              </h1>
              <p className="text-sm text-gray-500">
                We're sorry to see you go. Click below to unsubscribe from our
                mailing list.
              </p>
            </div>

            {/* Unsubscribe Button */}
            <button
              onClick={handleUnsubscribe}
              disabled={loading}
              className="w-full border border-gray-900 bg-gray-900 py-4 text-sm uppercase tracking-widest text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Unsubscribing..." : "Unsubscribe"}
            </button>

            {/* Back to Home Link */}
            <div className="mt-8 text-center text-sm text-gray-500">
              Changed your mind?{" "}
              <Link
                to="/"
                className="text-gray-900 underline transition-colors hover:text-gray-600"
              >
                Return home
              </Link>
            </div>
          </>
        )}

        {status === "success" && (
          <>
            {/* Success State */}
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <CheckCircle
                  className="h-16 w-16 text-green-600"
                  strokeWidth={1}
                />
              </div>
              <h1 className="mb-3 text-2xl font-light tracking-tight md:text-3xl">
                Unsubscribed Successfully
              </h1>
              <p className="mb-8 text-sm text-gray-500">{message}</p>

              <Link
                to="/"
                className="inline-block w-full border border-gray-900 bg-gray-900 py-4 text-sm uppercase tracking-widest text-white transition-colors hover:bg-gray-800"
              >
                Return Home
              </Link>
            </div>
          </>
        )}

        {status === "already" && (
          <>
            {/* Already Unsubscribed State */}
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <Mail className="h-16 w-16 text-gray-400" strokeWidth={1} />
              </div>
              <h1 className="mb-3 text-2xl font-light tracking-tight md:text-3xl">
                Already Unsubscribed
              </h1>
              <p className="mb-8 text-sm text-gray-500">
                You're already unsubscribed from our mailing list.
              </p>

              <Link
                to="/"
                className="inline-block w-full border border-gray-900 bg-gray-900 py-4 text-sm uppercase tracking-widest text-white transition-colors hover:bg-gray-800"
              >
                Return Home
              </Link>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            {/* Error State */}
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <XCircle className="h-16 w-16 text-red-600" strokeWidth={1} />
              </div>
              <h1 className="mb-3 text-2xl font-light tracking-tight md:text-3xl">
                Something Went Wrong
              </h1>
              <p className="mb-8 text-sm text-gray-500">{message}</p>

              <button
                onClick={handleUnsubscribe}
                disabled={loading}
                className="mb-4 w-full border border-gray-900 bg-gray-900 py-4 text-sm uppercase tracking-widest text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Try Again
              </button>

              <Link
                to="/"
                className="block text-sm text-gray-500 underline transition-colors hover:text-gray-900"
              >
                Return home
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Unsubscribe;
