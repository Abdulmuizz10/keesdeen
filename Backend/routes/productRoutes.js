import express from "express";
import {
  getHomeBestSellersController,
  getHomeCollectionsController,
  getHomeNewArrivalsController,
  getCollectionsShopAllController,
  getCollectionsNewArrivalsController,
  getCollectionsActiveWearController,
  getCollectionsFitnessAccessoriesController,
  getCollectionsProductByIdController,
  addProductReviewController,
  getCollectionsRelatedProductByIdController,
  searchSuggestionsWithProductsController,
  searchProductsResultsController,
  adminCreateProductController,
  adminGetProductsByPaginationController,
  adminGetProductByIdController,
  adminUpdateProductController,
  adminDeleteProductController,
  adminUpdateProductToBestSellerController,
  adminUpdateProductToNewArrivalController,
  adminUpdateProductAvailabilityController,
} from "../controllers/productControllers.js";

import { verifyUser, authorizeAdmin } from "../middleware/verify.js";

const router = express.Router();

// Client Routes
router.get("/home/best-sellers", getHomeBestSellersController);

router.get("/home/collections", getHomeCollectionsController);

router.get("/home/new-arrivals", getHomeNewArrivalsController);

router.get("/collections/shop-all", getCollectionsShopAllController);

router.get("/collections/new-arrivals", getCollectionsNewArrivalsController);

router.get("/collections/active-wears", getCollectionsActiveWearController);

router.get(
  "/collections/fitness-accessories",
  getCollectionsFitnessAccessoriesController
);

router.get("/collections/product/:id", getCollectionsProductByIdController);

router.post("/collections/product/:id/reviews", addProductReviewController);

router.get(
  "/collections/products/:id/related-products",
  getCollectionsRelatedProductByIdController
);

router.get(
  "/search/suggestions-products",
  searchSuggestionsWithProductsController
);

router.get("/results", searchProductsResultsController);

// Admin Routes
router.post(
  "/admin/create-product",
  verifyUser,
  authorizeAdmin,
  adminCreateProductController
);

router.get(
  "/admin/pagination-products",
  verifyUser,
  authorizeAdmin,
  adminGetProductsByPaginationController
);

router.get(
  "/admin/get-product/:id",
  verifyUser,
  authorizeAdmin,
  adminGetProductByIdController
);

router.put(
  "/admin/:id/update-product",
  verifyUser,
  authorizeAdmin,
  adminUpdateProductController
);

router.delete(
  "/admin/:id/delete-product",
  verifyUser,
  authorizeAdmin,
  adminDeleteProductController
);

router.patch(
  "/admin/update/:id/best-seller",
  verifyUser,
  authorizeAdmin,
  adminUpdateProductToBestSellerController
);

router.patch(
  "/admin/update/:id/new-arrival",
  verifyUser,
  authorizeAdmin,
  adminUpdateProductToNewArrivalController
);

router.patch(
  "/admin/update/:id/availability",
  verifyUser,
  authorizeAdmin,
  adminUpdateProductAvailabilityController
);

export default router;
