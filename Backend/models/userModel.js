import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true, // Prevent duplicate emails for registered users
      required: true,
      // match: [/.+@.+\..+/, "Please enter a valid email address"], // Basic email validation
    },
    password: {
      type: String,
      required: function () {
        return this.authMethod === "password"; // Required only for password-based users
      },
      select: false, // Exclude password from queries by default for security
    },
    isAdmin: {
      type: Boolean,
      default: false,
      required: true,
    },

    authMethod: {
      type: String,
      enum: ["password", "google"], // Define possible authentication methods
      default: "password",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("UserModel", userSchema);
