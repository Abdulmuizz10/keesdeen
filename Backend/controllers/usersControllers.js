import OrderModel from "../models/orderModel.js";
import UserModel from "../models/userModel.js";

const getCurrentUserProfile = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).select("-password");
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isAdmin: user.isAdmin,
      squareCustomerId: user.squareCustomerId,
      savedCards: user.savedCards,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserSavedCards = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware

    // Find all orders for this user
    const orders = await OrderModel.find({ user: userId })
      .select("paymentInfo createdAt")
      .sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return res.status(200).json({
        success: true,
        cards: [],
        message: "No cards found",
      });
    }

    // Extract unique cards based on cardLast4 + cardBrand combination
    const cardMap = new Map();

    orders.forEach((order) => {
      const paymentInfo = order.paymentInfo;

      // Only process if it's a card payment with last4 digits
      if (paymentInfo?.paymentSourceType === "CARD" && paymentInfo?.cardLast4) {
        const cardKey = `${paymentInfo.cardBrand || "UNKNOWN"}-${
          paymentInfo.cardLast4
        }`;

        // Only add if not already in map (keeps most recent usage)
        if (!cardMap.has(cardKey)) {
          cardMap.set(cardKey, {
            id: cardKey,
            cardBrand: paymentInfo.cardBrand || "UNKNOWN",
            cardLast4: paymentInfo.cardLast4,
            cardNumber: `**** **** **** ${paymentInfo.cardLast4}`,
            lastUsed: order.createdAt,
            paymentStatus: paymentInfo.paymentStatus,
          });
        }
      }
    });

    const cards = Array.from(cardMap.values());

    res.status(200).json({
      success: true,
      cards,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch saved cards",
    });
  }
};

const adminGetUsersByPagination = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const users = await UserModel.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const totalProducts = await UserModel.countDocuments();
    const totalPages = Math.ceil(totalProducts / limit);

    res.status(200).json({ users, totalPages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const adminGetUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await UserModel.findById(id).select("-password");
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
    const orders = await OrderModel.find({ user: id });
    res.status(200).json({ user, orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const adminUpdateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const newUser = await UserModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const adminUpdateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    let { isAdmin } = req.body;
    console.log(isAdmin);

    if (isAdmin === true) isAdmin = true;
    else if (isAdmin === false) isAdmin = false;
    else {
      return res
        .status(400)
        .json({ message: "isAdmin must be 'true' or 'false'" });
    }

    const user = await UserModel.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isAdmin = isAdmin;
    await user.save();

    res.status(200).json({
      message: `User updated to ${isAdmin ? "Administrator" : "Customer"}`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const adminDeleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await UserModel.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted" });
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getCurrentUserProfile,
  getUserSavedCards,
  adminGetUsersByPagination,
  adminGetUserById,
  adminUpdateUser,
  adminUpdateUserRole,
  adminDeleteUser,
};
