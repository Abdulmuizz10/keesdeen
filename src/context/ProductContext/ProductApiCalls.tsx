import axios from "axios";
import {
  getProductsStart,
  getProductsSuccess,
  getProductsFailure,
  getProductStart,
  getProductSuccess,
  getProductFailure,
  createProductStart,
  createProductSuccess,
  createProductFailure,
  updateProductStart,
  updateProductSuccess,
  updateProductFailure,
  deleteProductStart,
  deleteProductSuccess,
  deleteProductFailure,
  createReviewStart,
  createReviewSuccess,
  createReviewFailure,
} from "./ProductAction";
import { Dispatch } from "react";
import { URL } from "../../lib/constants";
import { toast } from "react-toastify";

type ProductAction =
  | ReturnType<typeof getProductsStart>
  | ReturnType<typeof getProductsSuccess>
  | ReturnType<typeof getProductsFailure>
  | ReturnType<typeof getProductStart>
  | ReturnType<typeof getProductSuccess>
  | ReturnType<typeof getProductFailure>
  | ReturnType<typeof createProductStart>
  | ReturnType<typeof createProductSuccess>
  | ReturnType<typeof createProductFailure>
  | ReturnType<typeof updateProductStart>
  | ReturnType<typeof updateProductSuccess>
  | ReturnType<typeof updateProductFailure>
  | ReturnType<typeof createReviewStart>
  | ReturnType<typeof createReviewSuccess>
  | ReturnType<typeof createReviewFailure>
  | ReturnType<typeof deleteProductStart>
  | ReturnType<typeof deleteProductSuccess>
  | ReturnType<typeof deleteProductFailure>;

// Fetch products
export const getProducts = async (dispatch: Dispatch<ProductAction>) => {
  dispatch(getProductsStart());
  try {
    const res = await axios.get(`${URL}/products`);
    dispatch(getProductsSuccess(res.data));
  } catch (err) {
    dispatch(getProductsFailure());
  }
};

export const getProduct = async (
  productId: string,
  dispatch: Dispatch<ProductAction>
) => {
  dispatch(getProductStart());
  try {
    const res = await axios.get(`${URL}/products/${productId}`);
    dispatch(getProductSuccess(res.data));
  } catch (err) {
    dispatch(getProductFailure());
  }
};

// Create a new product
export const createProduct = async (
  product: any,
  dispatch: Dispatch<ProductAction>
) => {
  dispatch(createProductStart());
  try {
    const res = await axios.post(`${URL}/products`, product, {
      headers: {
        token:
          "Bearer " + JSON.parse(localStorage.getItem("user") || "{}").token,
      },
    });
    dispatch(createProductSuccess(res.data));
    toast.success("Product created!");
  } catch (err) {
    dispatch(createProductFailure());
  }
};

// Update a product
export const updateProduct = async (
  product: any,
  dispatch: Dispatch<ProductAction>
) => {
  dispatch(updateProductStart());
  try {
    const res = await axios.put(`${URL}/products/${product._id}`, product, {
      headers: {
        token:
          "Bearer " + JSON.parse(localStorage.getItem("user") || "{}").token,
      },
    });
    dispatch(updateProductSuccess(res.data));
    toast.success("Product updated!");
  } catch (err) {
    dispatch(updateProductFailure());
  }
};

export const createReview = async (
  reviewInfo: any,
  productId: string,
  dispatch: Dispatch<ProductAction>
) => {
  dispatch(createReviewStart());
  try {
    const res = await axios.post<any>(
      `${URL}/products/${productId}/reviews`,
      reviewInfo
    );
    dispatch(createReviewSuccess(res.data));
    toast.success("Thanks for the review!");
  } catch (err) {
    dispatch(createReviewFailure());
  }
};

// Delete a product
export const deleteProduct = async (
  id: any,
  dispatch: Dispatch<ProductAction>
) => {
  dispatch(deleteProductStart());
  try {
    await axios.delete(`${URL}/products/${id}`, {
      headers: {
        token:
          "Bearer " + JSON.parse(localStorage.getItem("user") || "{}").token,
      },
    });
    dispatch(deleteProductSuccess(id));
    toast.success("Product has been deleted!");
  } catch (err) {
    dispatch(deleteProductFailure());
  }
};
