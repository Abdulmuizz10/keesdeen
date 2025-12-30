import { toast } from "sonner";
import axiosInstance from "@/lib/axiosConfig";

// Create a new product
export const createProduct = async (
  product: any,
  setProductName: any,
  setProductBrand: any,
  setProductDescription: any,
  setProductCategory: any,
  setProductSubCategory: any,
  setProductType: any,
  setProductSex: any,
  setProductColors: any,
  setProductPreviousPrice: any,
  setProductPrice: any,
  setProductSizes: any,
  setProductImages: any,
  setImagePreviews: any,
  setBestSeller: any,
  setNewArrival: any,
  setAdminLoader: any
) => {
  setAdminLoader(true);
  try {
    const res = await axiosInstance.post(`/products`, product, {
      validateStatus: (status: any) => status < 600,
    });
    if (res.status === 200) {
      toast.success("Product created!");
      // Clear form fields after submission
      setProductName("");
      setProductBrand("");
      setProductDescription("");
      setProductCategory("");
      setProductSubCategory("");
      setProductType("");
      setProductSex("");
      setProductColors([]);
      setProductPreviousPrice("");
      setProductPrice("");
      setProductSizes([]);
      setProductImages([]);
      setImagePreviews([]);
      setBestSeller(false);
      setNewArrival(false);
      setAdminLoader(false);
    } else {
      setAdminLoader(false);
      toast.error(res.data.message || "Something went wrong");
    }
  } catch (err) {
    setAdminLoader(false);
    toast.error("Something wrong, Product deleted!");
  }
};

// Update a product
export const updateProduct = async (
  product: any,
  setProductName: any,
  setProductBrand: any,
  setProductDescription: any,
  setProductCategory: any,
  setProductSubCategory: any,
  setProductType: any,
  setProductSex: any,
  setProductColors: any,
  setProductPreviousPrice: any,
  setProductPrice: any,
  setProductSizes: any,
  setProductImages: any,
  setImagePreviews: any,
  setBestSeller: any,
  setNewArrival: any,
  navigate: any,
  setAdminLoader: any
) => {
  setAdminLoader(true);
  try {
    const res = await axiosInstance.put(`/products/${product._id}`, product, {
      validateStatus: (status: any) => status < 600,
    });
    if (res.status === 200) {
      toast.success("Product updated!");
      // Clear form fields after submission
      setProductName("");
      setProductBrand("");
      setProductDescription("");
      setProductCategory("");
      setProductSubCategory("");
      setProductType("");
      setProductSex("");
      setProductColors([]);
      setProductPreviousPrice("");
      setProductPrice("");
      setProductSizes([]);
      setProductImages([]);
      setImagePreviews([]);
      setBestSeller(false);
      setNewArrival(false);
      // Navigate back to the products list
      setAdminLoader(false);
      navigate("/admin/products");
    } else {
      setAdminLoader(false);
      toast.error(res.data.message || "Something went wrong");
    }
  } catch (err) {
    setAdminLoader(false);
    toast.error("Product can't be updated");
  }
};

// Delete a product
export const deleteProduct = async (id: any, setAdminLoader: any) => {
  setAdminLoader(true);
  try {
    const res = await axiosInstance.delete(`/products/${id}`, {
      validateStatus: (status: any) => status < 600,
    });
    if (res.status === 200) {
      setAdminLoader(false);
      toast.success("Product deleted!");
    } else {
      setAdminLoader(false);
      toast.error(res.data.message || "Something went wrong");
    }
  } catch (err) {
    toast.error("Product can't be deleted!");
  }
};
