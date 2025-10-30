import express from "express";
import {
  createAddressController,
  getAddressController,
  getAddressByIdController,
  updateAddressController,
  deleteAddressController,
} from "../controllers/addressControllers.js";
import { verifyUser } from "../middleware/verify.js";

const router = express.Router();

router.post("/", verifyUser, createAddressController);

router.get("/get-address", verifyUser, getAddressController);

router.get("/address/:id", verifyUser, getAddressByIdController);

router.patch("/:id/update-address", verifyUser, updateAddressController);

router.delete("/:id/delete-address", verifyUser, deleteAddressController);

export default router;
