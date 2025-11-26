import mongoose from "mongoose";

const reviewSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "UserModel",
    },
    name: { type: String, required: false },
    rating: { type: Number, required: false },
    comment: { type: String, required: false },
    date: { type: Date, required: false },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    subcategory: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    previousPrice: {
      type: Number,
      required: false,
    },
    price: {
      type: Number,
      required: true,
    },
    sizes: {
      type: [String],
      required: true,
    },
    colors: {
      type: [String],
      required: true,
    },
    reviews: [reviewSchema],
    newArrival: {
      type: Boolean,
      required: false,
      default: false,
    },
    bestSeller: {
      type: Boolean,
      required: false,
      default: false,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    gender: {
      type: String,
      required: false,
    },
    imageUrls: {
      type: [String],
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const ProductModel = mongoose.model("ProductModel", productSchema);

export default ProductModel;
