import jwt from "jsonwebtoken";
import UserModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import axios from "axios";
import { sendResetEmailLink, sendWelcomeEmail } from "../lib/utils.js";
import dotenv from "dotenv";

dotenv.config();

// Maximum number of refresh tokens per user (prevents unlimited device logins)
const MAX_REFRESH_TOKENS = 5;

// Generate Access Token (short-lived)
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, isAdmin: user.isAdmin },
    process.env.SECRET_KEY,
    { expiresIn: "15m" }
  );
};

// Generate Refresh Token (long-lived)
const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.REFRESH_SECRET_KEY, {
    expiresIn: "30d",
  });
};

// Set tokens in cookies and response
const createAndSendTokens = async (user, res) => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Calculate expiration date
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30); // 30 days from now

  // Add new refresh token to user's token array
  await UserModel.findByIdAndUpdate(user._id, {
    $push: {
      refreshTokens: {
        $each: [{ token: refreshToken, expiresAt }],
        $slice: -MAX_REFRESH_TOKENS, // Keep only the last N tokens
      },
    },
  });

  // const cookieDomain =
  //   process.env.NODE_ENV === "production"
  //     ? "keesdeen-api.vercel.app"
  //     : "localhost";

  // Set access token cookie
  res.cookie("authToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    maxAge: 15 * 60 * 1000,
    // domain: cookieDomain,
  });

  // Set refresh token cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    maxAge: 30 * 24 * 60 * 60 * 1000,
    // domain: cookieDomain,
  });

  return res.status(200).json({
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    isAdmin: user.isAdmin,
    squareCustomerId: user.squareCustomerId,
    savedCards: user.savedCards,
  });
};

const signUp = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "account already exists." });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await UserModel.create({
      firstName,
      lastName,
      email,
      authMethod: "password",
      password: hashedPassword,
    });

    try {
      sendWelcomeEmail(email, firstName, "signup");
    } catch (err) {
      console.error("Email failed:", err);
    }
    return createAndSendTokens(newUser, res);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong, please try again." });
  }
};

const signIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await UserModel.findOne({ email }).select("+password");
    if (!existingUser) {
      return res.status(404).json({ message: "Invalid email or password." });
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    try {
      sendWelcomeEmail(email, existingUser.firstName, "signin");
    } catch (err) {
      console.error("Email failed:", err);
    }
    return createAndSendTokens(existingUser, res);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong, please try again." });
  }
};

const googleSignIn = async (req, res) => {
  const { googleToken } = req.body;
  try {
    const response = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${googleToken}`,
        },
      }
    );
    const {
      email,
      given_name: firstName,
      family_name: lastName,
    } = response.data;

    let user = await UserModel.findOne({ email });
    if (!user) {
      user = await UserModel.create({
        firstName,
        lastName,
        email,
        authMethod: "google",
      });

      try {
        sendWelcomeEmail(email, firstName, "signup");
      } catch (err) {
        console.error("Email failed:", err);
      }
    } else {
      try {
        sendWelcomeEmail(email, user.firstName, "signin");
      } catch (err) {
        console.error("Email failed:", err);
      }
    }

    return createAndSendTokens(user, res);
  } catch (error) {
    return res.status(500).json({ message: "Google sign-in failed" });
  }
};

// Refresh access token
const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token not found" });
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY);

    // Find user
    const user = await UserModel.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if refresh token exists in database and is not expired
    const storedToken = user.refreshTokens.find(
      (rt) => rt.token === refreshToken && new Date(rt.expiresAt) > new Date()
    );

    if (!storedToken) {
      return res.status(403).json({
        message: "Invalid or expired refresh token",
      });
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user);

    const cookieDomain =
      process.env.NODE_ENV === "production"
        ? "keesdeen-api.vercel.app"
        : "localhost";

    // Set new access token cookie
    res.cookie("authToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 15 * 60 * 1000,
      // domain: cookieDomain,
    });

    return res.status(200).json({
      message: "Token refreshed successfully",
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isAdmin: user.isAdmin,
      squareCustomerId: user.squareCustomerId,
      savedCards: user.savedCards,
    });
  } catch (error) {
    return res
      .status(403)
      .json({ message: "Invalid or expired refresh token" });
  }
};

const logout = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    // Remove specific refresh token from database
    if (refreshToken) {
      try {
        const decoded = jwt.verify(
          refreshToken,
          process.env.REFRESH_SECRET_KEY
        );
        await UserModel.findByIdAndUpdate(decoded.id, {
          $pull: { refreshTokens: { token: refreshToken } },
        });
      } catch (error) {
        // Token might be invalid, but we still clear cookies
      }
    }

    // Clear both cookies
    res.clearCookie("authToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong, please try again." });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    const resetUrl = `${process.env.FRONTEND_URL}/auth/reset_password/${resetToken}`;
    const message = `Click here to reset your password: ${resetUrl}`;

    await sendResetEmailLink({
      email: user.email,
      subject: "Password Reset",
      message,
    });

    res.json({ message: "Reset link sent to your email" });
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
  }
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await UserModel.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "Invalid or expired token" });
    }

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();
    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Invalid or expired token" });
  }
};

// Cleanup expired tokens (called by cron job)
export const cleanupExpiredTokens = async () => {
  try {
    const result = await UserModel.updateMany(
      {},
      {
        $pull: {
          refreshTokens: {
            expiresAt: { $lt: new Date() },
          },
        },
      }
    );
    console.log(
      `Expired refresh tokens cleaned up: ${result.modifiedCount} users affected`
    );
  } catch (error) {
    console.error("Error cleaning up expired tokens:", error);
  }
};

export {
  signUp,
  signIn,
  googleSignIn,
  logout,
  forgotPassword,
  resetPassword,
  refreshAccessToken,
};
