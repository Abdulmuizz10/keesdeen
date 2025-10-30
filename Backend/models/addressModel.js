import mongoose from "mongoose";

const addressItemsSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  country: { type: String, required: true },
  state: { type: String, required: true },
  address1: { type: String, required: true },
  address2: { type: String },
  phone: { type: String, required: true },
  postalCode: { type: String, required: true },
});

const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
      required: true,
    },
    shippingAddress: { type: addressItemsSchema, required: true },
    billingAddress: { type: addressItemsSchema, required: true },
  },
  { timestamps: true }
);

const AddressModel = mongoose.model("AddressModel", addressSchema);

export default AddressModel;
