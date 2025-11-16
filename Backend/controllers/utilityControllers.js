import UtilityModel from "../models/utilityModel.js";

const adminCreateUtility = async (req, res) => {
  try {
    const utility = await UtilityModel.create(req.body);
    res.status(201).json(utility);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const adminGetUtility = async (req, res) => {
  try {
    const utility = await UtilityModel.findOne();
    if (!utility) {
      return res.status(200).json({
        shippingFee: 0,
      });
    }
    const response = {
      shippingFee: utility.shippingFee ?? 0,
    };
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const adminUpdateUtility = async (req, res) => {
  try {
    const utility = await UtilityModel.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
    });
    res.status(200).json(utility);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export { adminCreateUtility, adminGetUtility, adminUpdateUtility };
