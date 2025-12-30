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
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: function () {
        return this.authMethod === "password";
      },
      select: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
      required: true,
    },
    authMethod: {
      type: String,
      enum: ["password", "google"],
      default: "password",
    },
    refreshTokens: {
      type: [
        {
          token: {
            type: String,
            required: true,
          },
          expiresAt: {
            type: Date,
            required: true,
          },
          createdAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      default: [],
    },
    squareCustomerId: {
      type: String,
    },
    savedCards: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ "refreshTokens.expiresAt": 1 });
export default mongoose.model("UserModel", userSchema);
