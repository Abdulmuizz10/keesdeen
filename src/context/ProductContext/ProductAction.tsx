import { Product } from "../../lib/types";

export const getProductsStart = (): { type: "GET_PRODUCTS_START" } => ({
  type: "GET_PRODUCTS_START",
});

export const getProductsSuccess = (
  products: Product[]
): { type: "GET_PRODUCTS_SUCCESS"; payload: Product[] } => ({
  type: "GET_PRODUCTS_SUCCESS",
  payload: products,
});

export const getProductFailure = (): { type: "GET_PRODUCT_FAILURE" } => ({
  type: "GET_PRODUCT_FAILURE",
});

export const getProductsByPageStart = (): {
  type: "GET_PRODUCTS_BY_PAGE_START";
} => ({
  type: "GET_PRODUCTS_BY_PAGE_START",
});

export const getProductsByPageSuccess = (
  products: any
): { type: "GET_PRODUCTS_BY_PAGE_SUCCESS"; payload: any } => ({
  type: "GET_PRODUCTS_BY_PAGE_SUCCESS",
  payload: products,
});

export const getProductsByPageFailure = (): {
  type: "GET_PRODUCTS_BY_PAGE_FAILURE";
} => ({
  type: "GET_PRODUCTS_BY_PAGE_FAILURE",
});

export const getProductStart = (): { type: "GET_PRODUCT_START" } => ({
  type: "GET_PRODUCT_START",
});

export const getProductSuccess = (
  products: Product
): { type: "GET_PRODUCT_SUCCESS"; payload: Product } => ({
  type: "GET_PRODUCT_SUCCESS",
  payload: products,
});

export const getProductsFailure = (): { type: "GET_PRODUCTS_FAILURE" } => ({
  type: "GET_PRODUCTS_FAILURE",
});

export const createProductStart = (): { type: "CREATE_PRODUCT_START" } => ({
  type: "CREATE_PRODUCT_START",
});

export const createProductSuccess = (
  product: any
): { type: "CREATE_PRODUCT_SUCCESS"; payload: any } => ({
  type: "CREATE_PRODUCT_SUCCESS",
  payload: product,
});

export const createProductFailure = (): {
  type: "CREATE_PRODUCT_FAILURE";
} => ({
  type: "CREATE_PRODUCT_FAILURE",
});

export const updateProductStart = (): { type: "UPDATE_PRODUCT_START" } => ({
  type: "UPDATE_PRODUCT_START",
});

export const updateProductSuccess = (
  product: any
): { type: "UPDATE_PRODUCT_SUCCESS"; payload: any } => ({
  type: "UPDATE_PRODUCT_SUCCESS",
  payload: product,
});

export const updateProductFailure = (): {
  type: "UPDATE_PRODUCT_FAILURE";
} => ({
  type: "UPDATE_PRODUCT_FAILURE",
});

export const createReviewStart = (): { type: "CREATE_REVIEW_START" } => ({
  type: "CREATE_REVIEW_START",
});

export const createReviewSuccess = (
  product: Product
): { type: "CREATE_REVIEW_SUCCESS"; payload: Product } => ({
  type: "CREATE_REVIEW_SUCCESS",
  payload: product,
});

export const createReviewFailure = (): {
  type: "CREATE_REVIEW_FAILURE";
} => ({
  type: "CREATE_REVIEW_FAILURE",
});

export const deleteProductStart = (): { type: "DELETE_PRODUCT_START" } => ({
  type: "DELETE_PRODUCT_START",
});

export const deleteProductSuccess = (
  id: any
): { type: "DELETE_PRODUCT_SUCCESS"; payload: any } => ({
  type: "DELETE_PRODUCT_SUCCESS",
  payload: id,
});

export const deleteProductFailure = (): {
  type: "DELETE_PRODUCT_FAILURE";
} => ({
  type: "DELETE_PRODUCT_FAILURE",
});
