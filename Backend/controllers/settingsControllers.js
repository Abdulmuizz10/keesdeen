import SettingsModel from "../models/settingsModel.js";

// Get hero settings (public)
const getHeroController = async (req, res) => {
  try {
    let settings = await SettingsModel.findOne();

    // Create default settings if none exist
    if (!settings) {
      settings = await SettingsModel.create({
        images: [],
        transitionDuration: 1000,
        autoPlayInterval: 5000,
      });
    }

    // Get active images only and sort by order
    const activeImages = settings.images
      .filter((img) => img.isActive)
      .sort((a, b) => a.order - b.order);

    res.status(200).json({
      success: true,
      data: {
        images: activeImages,
        transitionDuration: settings.transitionDuration,
        autoPlayInterval: settings.autoPlayInterval,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching hero settings",
      error: error.message,
    });
  }
};

// Get all hero settings (admin)
const adminGetHeroSettingsController = async (req, res) => {
  try {
    let settings = await SettingsModel.findOne();

    if (!settings) {
      settings = await SettingsModel.create({
        images: [],
        transitionDuration: 1000,
        autoPlayInterval: 5000,
      });
    }

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching hero settings",
      error: error.message,
    });
  }
};

// Update hero settings
const adminUpdateHeroSettingsController = async (req, res) => {
  try {
    const { images, transitionDuration, autoPlayInterval } = req.body;

    let settings = await SettingsModel.findOne();

    if (!settings) {
      settings = new SettingsModel();
    }

    if (images !== undefined) settings.images = images;
    if (transitionDuration !== undefined)
      settings.transitionDuration = transitionDuration;
    if (autoPlayInterval !== undefined)
      settings.autoPlayInterval = autoPlayInterval;

    await settings.save();

    res.status(200).json({
      success: true,
      message: "Hero settings updated successfully",
      data: settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating hero settings",
      error: error.message,
    });
  }
};

// Add a new hero image
const adminCreateHeroImageController = async (req, res) => {
  try {
    const { url, tagline, isActive = true } = req.body;

    if (!url || !tagline) {
      return res.status(400).json({
        success: false,
        message: "URL and tagline are required",
      });
    }

    let settings = await SettingsModel.findOne();

    if (!settings) {
      settings = new SettingsModel();
    }

    // Determine next order
    const nextOrder =
      settings.images.length > 0
        ? Math.max(...settings.images.map((img) => img.order)) + 1
        : 0;

    settings.images.push({
      url,
      tagline,
      isActive,
      order: nextOrder,
    });

    await settings.save();

    res.status(200).json({
      success: true,
      message: "Hero image added successfully",
      data: settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding hero image",
      error: error.message,
    });
  }
};

// Update a single hero image
const adminUpdateHeroImageController = async (req, res) => {
  try {
    const { imageId } = req.params;
    const { url, tagline, isActive, order } = req.body;

    const settings = await SettingsModel.findOne();

    if (!settings) {
      return res.status(404).json({
        success: false,
        message: "Hero settings not found",
      });
    }

    const image = settings.images.find((img) => img._id.toString() === imageId);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Hero image not found",
      });
    }

    if (url !== undefined) image.url = url;
    if (tagline !== undefined) image.tagline = tagline;
    if (isActive !== undefined) image.isActive = isActive;
    if (order !== undefined) image.order = order;

    await settings.save();

    res.status(200).json({
      success: true,
      message: "Hero image updated successfully",
      data: settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating hero image",
      error: error.message,
    });
  }
};

// Delete hero image
const adminDeleteHeroImage = async (req, res) => {
  try {
    const { imageId } = req.params;

    const settings = await SettingsModel.findOne();

    if (!settings) {
      return res.status(404).json({
        success: false,
        message: "Hero settings not found",
      });
    }

    settings.images = settings.images.filter(
      (img) => img._id.toString() !== imageId
    );

    await settings.save();

    res.status(200).json({
      success: true,
      message: "Hero image deleted successfully",
      data: settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting hero image",
      error: error.message,
    });
  }
};

// Reorder hero images
const adminReorderHeroImages = async (req, res) => {
  try {
    const { imageOrders } = req.body;

    if (!Array.isArray(imageOrders)) {
      return res.status(400).json({
        success: false,
        message: "imageOrders must be an array",
      });
    }

    const settings = await SettingsModel.findOne();

    if (!settings) {
      return res.status(404).json({
        success: false,
        message: "Hero settings not found",
      });
    }

    imageOrders.forEach(({ imageId, order }) => {
      const image = settings.images.find(
        (img) => img._id.toString() === imageId
      );
      if (image) {
        image.order = order;
      }
    });

    await settings.save();

    res.status(200).json({
      success: true,
      message: "Hero images reordered successfully",
      data: settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error reordering hero images",
      error: error.message,
    });
  }
};

export {
  getHeroController,
  adminGetHeroSettingsController,
  adminUpdateHeroSettingsController,
  adminCreateHeroImageController,
  adminUpdateHeroImageController,
  adminDeleteHeroImage,
  adminReorderHeroImages,
};
