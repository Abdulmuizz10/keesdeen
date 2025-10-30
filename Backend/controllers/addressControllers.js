import mongoose from "mongoose";
import AddressModel from "../models/addressModel.js";

const createAddressController = async (req, res) => {
  try {
    const address = new AddressModel(req.body);
    const savedAddress = await address.save();
    res.status(200).json(savedAddress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAddressController = async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user.id);
  if (userId) {
    try {
      const address = await AddressModel.find({ user: userId }).sort({
        createdAt: -1,
      });
      res.status(200).json(address);
    } catch (error) {
      res.status(500).json({ message: "Error getting address" });
    }
  } else {
    return res.status(400).json({ message: "User ID is missing or invalid" });
  }
};

const updateAddressController = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedAddress = await AddressModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedAddress) {
      return res.status(404).json({ message: "Address not found" });
    }
    res.status(200).json(updatedAddress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteAddressController = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedAddress = await AddressModel.findByIdAndDelete(id);
    if (!deletedAddress) {
      return res.status(404).json({ message: "Address not found" });
    }
    res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAddressByIdController = async (req, res) => {
  const { id } = req.params;
  try {
    const address = await AddressModel.findById(id);
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }
    res.status(200).json(address);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  createAddressController,
  getAddressController,
  updateAddressController,
  deleteAddressController,
  getAddressByIdController,
};
