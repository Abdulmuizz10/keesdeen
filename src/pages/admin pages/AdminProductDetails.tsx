import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../../components/Spinner";
import { Product } from "../../lib/types";
import { URL } from "../../lib/constants";
import Axios from "axios";
import { formatAmount } from "../../lib/utils";

const AdminProductDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [product, setProduct] = useState<Product | null>(null);
  const navigate = useNavigate();

  if (!id) {
    navigate("/");
    return null;
  }

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await Axios.get(`${URL}/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Spinner />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-600">Product not found.</p>
      </div>
    );
  }

  return (
    <section className="container mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Product Details
        </h1>

        <div className="flex flex-col gap-10">
          <div className="w-full">
            <div className="hidden lg:grid lg:grid-cols-3 xl:grid-cols-5 w-full gap-2">
              {product?.imageUrls.map((image, index) => (
                <div className="h-[370px] w-full" key={index}>
                  <img
                    src={image}
                    alt="product image"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Information */}
          <div>
            <p className="text-lg text-gray-600 mb-2">
              <span className="font-medium">Product Name:</span> {product.name}
            </p>
            <p className="text-lg text-gray-600 mb-2">
              <span className="font-medium">Price:</span>{" "}
              {formatAmount(product.price)}
            </p>
            <p className="text-lg text-gray-600 mb-2">
              <span className="font-medium">Category:</span> {product.category}
            </p>
            <p className="text-lg text-gray-600 mb-2">
              <span className="font-medium">Sub-Category:</span>{" "}
              {product.subcategory || "N/A"}
            </p>

            <div className="my-2">
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                Available Sizes:
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.size.map((size, index) => (
                  <span
                    key={index}
                    className="w-10 flex items-center justify-center py-1 bg-gray-100 text-gray-800 text-sm border"
                  >
                    {size}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-lg text-gray-600 mb-2">
              <span className="font-medium">Best Seller:</span>{" "}
              {product.bestSeller === true ? "True" : "False"}
            </p>

            <p className="text-lg text-gray-600 mb-2">
              <span className="font-medium">New Arrival:</span>{" "}
              {product.newArrival === true ? "True" : "False"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminProductDetails;
