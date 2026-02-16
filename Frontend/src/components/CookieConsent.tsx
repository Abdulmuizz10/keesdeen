import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { URL } from "@/lib/constants";

interface ConsentPreferences {
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

const CookieConsent: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState<ConsentPreferences>({
    analytics: false,
    marketing: false,
    preferences: false,
  });

  useEffect(() => {
    const interval = setTimeout(() => {
      checkConsentStatus();
    }, 10000);

    return () => clearTimeout(interval);
  }, []);

  const checkConsentStatus = async () => {
    try {
      const response = await axios.get(`${URL}/cookie-consent`, {
        withCredentials: true,
      });
      if (!response.data.hasConsent) {
        setShowBanner(true);
      }
    } catch (error) {
      console.error("Error checking consent:", error);
      setShowBanner(true);
    }
  };

  const handleAcceptAll = async () => {
    setLoading(true);
    try {
      await axios.post(
        `${URL}/cookie-consent`,
        {
          analytics: true,
          marketing: true,
          preferences: true,
        },
        { withCredentials: true },
      );
      setShowBanner(false);
      initializeThirdPartyScripts(true, true, true);
    } catch (error) {
      console.error("Error saving consent:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectAll = async () => {
    setLoading(true);
    try {
      await axios.post(
        `${URL}/cookie-consent`,
        {
          analytics: false,
          marketing: false,
          preferences: false,
        },
        { withCredentials: true },
      );
      setShowBanner(false);
    } catch (error) {
      console.error("Error saving consent:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePreferences = async () => {
    setLoading(true);
    try {
      await axios.post(`${URL}/cookie-consent`, preferences, {
        withCredentials: true,
      });
      setShowBanner(false);
      setShowSettings(false);
      initializeThirdPartyScripts(
        preferences.analytics,
        preferences.marketing,
        preferences.preferences,
      );
    } catch (error) {
      console.error("Error saving preferences:", error);
    } finally {
      setLoading(false);
    }
  };

  const initializeThirdPartyScripts = (
    analytics: boolean,
    marketing: boolean,
    prefs: boolean,
  ) => {
    if (analytics && (window as any).gtag) {
      (window as any).gtag("consent", "update", {
        analytics_storage: "granted",
      });
    }
    if (marketing) {
      // Facebook Pixel, Google Ads, etc.
    }
    if (prefs) {
      // Theme preferences, language preferences, etc.
    }
  };

  const togglePreference = (key: keyof ConsentPreferences) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Main Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-[9999] border-t border-gray-900 bg-white px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6">
          <div className="max-w-3xl">
            <h3 className="mb-3 text-[11px] font-medium uppercase tracking-[2px] text-gray-900">
              Cookie Notice
            </h3>
            <p className="text-[13px] font-light leading-relaxed text-gray-900">
              We use cookies to enhance your browsing experience and analyze our
              traffic. By clicking "Accept All", you consent to our use of
              cookies.{" "}
              <Link
                to="/privacy_policy"
                className="underline underline-offset-2 transition-opacity hover:opacity-70"
              >
                Privacy Policy
              </Link>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleAcceptAll}
              disabled={loading}
              className="border border-gray-900 bg-gray-900 px-8 py-3.5 text-[11px] font-medium uppercase tracking-[2px] text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Accept All
            </button>

            <button
              onClick={handleRejectAll}
              disabled={loading}
              className="border border-gray-900 bg-white px-8 py-3.5 text-[11px] font-medium uppercase tracking-[2px] text-gray-900 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Reject All
            </button>

            <button
              onClick={() => setShowSettings(!showSettings)}
              disabled={loading}
              className="border border-gray-900 bg-white px-8 py-3.5 text-[11px] font-medium uppercase tracking-[2px] text-gray-900 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Customize
            </button>
          </div>
        </div>
      </div>

      {/* Cookie Settings Modal */}
      {showSettings && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/40 backdrop-blur-sm p-6"
          onClick={() => setShowSettings(false)}
        >
          <div
            className="max-h-[85vh] w-full max-w-xl overflow-auto border bg-white p-10 custom-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-8 text-[11px] font-medium uppercase tracking-[2px] text-gray-900">
              Cookie Preferences
            </h2>

            <div className="mb-8 space-y-4">
              {/* Essential Cookies */}
              <div className="border border-gray-200 p-6">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <h4 className="mb-2 text-[12px] font-medium uppercase tracking-[1.5px] text-gray-900">
                      Essential Cookies
                    </h4>
                    <p className="text-[13px] font-light leading-relaxed text-gray-600">
                      Required for the website to function. Cannot be disabled.
                    </p>
                  </div>
                  <span className="whitespace-nowrap text-[11px] font-medium uppercase tracking-[1.5px] text-gray-900">
                    Always On
                  </span>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="border border-gray-200 p-6">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <h4 className="mb-2 text-[12px] font-medium uppercase tracking-[1.5px] text-gray-900">
                      Analytics Cookies
                    </h4>
                    <p className="text-[13px] font-light leading-relaxed text-gray-600">
                      Help us understand how visitors interact with our website.
                    </p>
                  </div>
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={() => togglePreference("analytics")}
                      className="h-[18px] w-[18px] cursor-pointer accent-gray-900"
                    />
                  </label>
                </div>
              </div>

              {/* Marketing Cookies */}
              <div className="border border-gray-200 p-6">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <h4 className="mb-2 text-[12px] font-medium uppercase tracking-[1.5px] text-gray-900">
                      Marketing Cookies
                    </h4>
                    <p className="text-[13px] font-light leading-relaxed text-gray-600">
                      Used to track visitors and display relevant
                      advertisements.
                    </p>
                  </div>
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={() => togglePreference("marketing")}
                      className="h-[18px] w-[18px] cursor-pointer accent-gray-900"
                    />
                  </label>
                </div>
              </div>

              {/* Preference Cookies */}
              <div className="border border-gray-200 p-6">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <h4 className="mb-2 text-[12px] font-medium uppercase tracking-[1.5px] text-gray-900">
                      Preference Cookies
                    </h4>
                    <p className="text-[13px] font-light leading-relaxed text-gray-600">
                      Remember your settings for a personalized experience.
                    </p>
                  </div>
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={preferences.preferences}
                      onChange={() => togglePreference("preferences")}
                      className="h-[18px] w-[18px] cursor-pointer accent-gray-900"
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowSettings(false)}
                className="border border-gray-900 bg-white px-8 py-3.5 text-[11px] font-medium uppercase tracking-[2px] text-gray-900 transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePreferences}
                disabled={loading}
                className="border border-gray-900 bg-gray-900 px-8 py-3.5 text-[11px] font-medium uppercase tracking-[2px] text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CookieConsent;
