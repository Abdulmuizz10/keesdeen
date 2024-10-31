// Define action types

import { Product, ProductState, ProductAction } from "../../lib/types";

// Define the reducer function with types

const ProductReducer = (
  state: ProductState,
  action: ProductAction
): ProductState => {
  const startFetching = (state: ProductState) => ({
    ...state,
    isFetching: true,
    error: false,
  });

  const fetchFailure = (state: ProductState) => ({
    ...state,
    isFetching: false,
    error: true,
  });

  switch (action.type) {
    case "GET_PRODUCTS_START":
    case "GET_PRODUCT_START":
    case "CREATE_PRODUCT_START":
    case "UPDATE_PRODUCT_START":
    case "CREATE_REVIEW_START":
    case "DELETE_PRODUCT_START":
      return startFetching(state);

    case "GET_PRODUCTS_SUCCESS":
      return {
        ...state,
        products: action.payload,
        isFetching: false,
        error: false,
      };

    case "GET_PRODUCT_SUCCESS":
      return {
        ...state,
        product: action.payload,
        isFetching: false,
        error: false,
      };

    case "CREATE_PRODUCT_SUCCESS":
      return {
        ...state,
        products: [...state.products, action.payload],
        isFetching: false,
        error: false,
      };

    case "UPDATE_PRODUCT_SUCCESS":
      return {
        ...state,
        products: state.products.map((product) =>
          product._id === action.payload._id ? action.payload : product
        ),
        isFetching: false,
        error: false,
      };

    case "CREATE_REVIEW_SUCCESS":
      return {
        ...state,
        products: state.products.map((product) =>
          product._id === action.payload._id ? action.payload : product
        ),
        isFetching: false,
        error: false,
      };

    case "DELETE_PRODUCT_SUCCESS":
      const isDeletedProductSelected = state.product?._id === action.payload;
      return {
        ...state,
        products: state.products.filter(
          (product: Product) => product._id !== action.payload
        ),
        product: isDeletedProductSelected ? null : state.product,
        isFetching: false,
        error: false,
      };

    case "GET_PRODUCTS_FAILURE":
    case "GET_PRODUCT_FAILURE":
    case "CREATE_PRODUCT_FAILURE":
    case "UPDATE_PRODUCT_FAILURE":
    case "CREATE_REVIEW_FAILURE":
    case "DELETE_PRODUCT_FAILURE":
      return fetchFailure(state);

    default:
      return state;
  }
};

export default ProductReducer;
export type { ProductAction };
