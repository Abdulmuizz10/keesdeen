import mongoose from "mongoose";

const HeroSchema = mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  tagline: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    required: true,
  },
});

const settingsSchema = new mongoose.Schema(
  {
    images: {
      type: [HeroSchema],
      default: [],
    },
    transitionDuration: {
      type: Number,
      default: 1000,
    },
    autoPlayInterval: {
      type: Number,
      default: 5000,
    },
  },
  {
    timestamps: true,
  }
);

const SettingsModel = mongoose.model("SettingsModel", settingsSchema);

export default SettingsModel;
