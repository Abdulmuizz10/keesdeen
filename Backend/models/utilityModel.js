import mongoose from "mongoose";

const utilitySchema = new mongoose.Schema(
  {
    shippingFee: {
      type: Number,
      default: 0,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("UtilityModel", utilitySchema);
