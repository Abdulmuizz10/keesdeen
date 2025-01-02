import axios from "axios";
import { URL } from "../../lib/constants";
import { toast } from "react-toastify";

// Create a new product
export const createProduct = async (product: any) => {
  try {
    const res = await axios.post(`${URL}/products`, product, {
      withCredentials: true,
      validateStatus: (status: any) => status < 600,
    });
    if (res.status === 200) {
      toast.success("Product created!");
    } else {
      toast.error(res.data.message || "Something went wrong");
    }
  } catch (err) {
    toast.error("Something wrong, Product deleted!");
  }
};

// Update a product
export const updateProduct = async (product: any) => {
  try {
    const res = await axios.put(`${URL}/products/${product._id}`, product, {
      withCredentials: true,
      validateStatus: (status: any) => status < 600,
    });
    if (res.status === 200) {
      toast.success("Product updated!");
    } else {
      toast.error(res.data.message || "Something went wrong");
    }
  } catch (err) {
    toast.error("Product can't be updated");
  }
};

export const createReview = async (reviewInfo: any, productId: string) => {
  try {
    await axios.post<any>(`${URL}/products/${productId}/reviews`, reviewInfo);
    toast.success("Thanks for the review!");
  } catch (err) {
    toast.error("Something wrong. Couldn't submit a review!");
  }
};

// Delete a product
export const deleteProduct = async (id: any) => {
  try {
    const res = await axios.delete(`${URL}/products/${id}`, {
      withCredentials: true,
      validateStatus: (status: any) => status < 600,
    });
    if (res.status === 200) {
      toast.success("Product deleted!");
    } else {
      toast.error(res.data.message || "Something went wrong");
    }
  } catch (err) {
    toast.error("Product can't be deleted!");
  }
};
