import { useEffect, useContext, useRef } from "react";
import { toast } from "sonner";
import axios from "axios";
import { URL } from "./constants";
import { AuthContext } from "@/context/AuthContext/AuthContext";
import { Logout } from "@/context/AuthContext/AuthActions";

const API_URL = URL;

/**
 * ENHANCED VERSION: Verifies token on mount AND when user returns to the tab
 * This provides the smoothest experience, just like MongoDB Atlas
 */
const useTokenVerification = () => {
  const { user, dispatch } = useContext(AuthContext);
  const lastCheckRef = useRef<number>(0);
  const MIN_CHECK_INTERVAL = 60000; // Don't check more than once per minute

  const verifyToken = async () => {
    // Skip if not logged in
    if (!user) return;

    // Throttle checks to avoid excessive API calls
    const now = Date.now();
    if (now - lastCheckRef.current < MIN_CHECK_INTERVAL) {
      return;
    }
    lastCheckRef.current = now;

    try {
      const response = await axios.get(`${API_URL}/auth/verify-token`, {
        withCredentials: true,
      });

      const { isValid, reason, user: userData } = response.data;

      if (!isValid) {
        console.log(`Token verification failed: ${reason}`);

        dispatch(Logout());
        localStorage.removeItem("user");

        if (reason === "token_expired") {
          toast.error("Your session has expired. Please sign in again.");
        }

        window.location.href = "/auth/Sign_in";
      } else {
        // Update user data if changed
        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
        if (JSON.stringify(currentUser) !== JSON.stringify(userData)) {
          localStorage.setItem("user", JSON.stringify(userData));
        }
      }
    } catch (error) {
      // console.error("Token verification error:", error);
      dispatch(Logout());
      localStorage.removeItem("user");
    }
  };

  useEffect(() => {
    // Verify on mount
    verifyToken();

    // Verify when user returns to the tab/window
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        verifyToken();
      }
    };

    const handleFocus = () => {
      verifyToken();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [user, dispatch]);
};

export default useTokenVerification;
