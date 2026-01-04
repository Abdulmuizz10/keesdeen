import express from "express";
const router = express.Router();

// Store user's cookie preferences
router.post("/api/cookie-consent", async (req, res) => {
  try {
    const { analytics, marketing, preferences } = req.body;

    // Create consent object
    const consentData = {
      analytics: analytics || false,
      marketing: marketing || false,
      preferences: preferences || false,
      timestamp: new Date().toISOString(),
      version: "1.0", // track your privacy policy version
    };

    // Set a cookie with the consent preferences (essential cookie, doesn't need consent)
    res.cookie("cookie_consent", JSON.stringify(consentData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // only HTTPS in production
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
    });

    // Optional: Store in database if you want to track consent by user
    // if (req.user) {
    //   await User.findByIdAndUpdate(req.user.id, {
    //     cookieConsent: consentData
    //   });
    // }

    res.status(200).json({
      success: true,
      message: "Cookie preferences saved",
      consent: consentData,
    });
  } catch (error) {
    console.error("Cookie consent error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save cookie preferences",
    });
  }
});

// Get current cookie consent status
router.get("/api/cookie-consent", (req, res) => {
  try {
    const consentCookie = req.cookies.cookie_consent;

    if (consentCookie) {
      const consent = JSON.parse(consentCookie);
      res.status(200).json({
        success: true,
        consent,
        hasConsent: true,
      });
    } else {
      res.status(200).json({
        success: true,
        hasConsent: false,
      });
    }
  } catch (error) {
    console.error("Get consent error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve cookie preferences",
    });
  }
});

export default router;
