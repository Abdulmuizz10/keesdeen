import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../../components/Spinner";
import { URL } from "../../lib/constants";
import Axios from "axios";
import { toast } from "sonner";
import { formatAmountDefault } from "../../lib/utils";

const AdminProductDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [product, setProduct] = useState<any>();
  const navigate = useNavigate();

  if (!id) {
    navigate("/");
    return null;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Axios.get(`${URL}/products/${id}`);
        setProduct(response.data.product);
      } catch (error) {
        toast.error("Error fetching product");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white rounded-lg">
        <Spinner />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center h-screen bg-white rounded-lg">
        <p className="text-gray-600">Product not found.</p>
      </div>
    );
  }

  return (
    <section className="w-full min-h-[130vh] bg-white rounded">
      <div className="rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Product Details
        </h1>

        <div className="flex flex-col gap-10">
          <div className="w-full">
            <div className="grid md:grid-cols-2 w-full gap-2">
              {product?.imageUrls.map((image: any, index: number) => (
                <div className="h-full w-full" key={index}>
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
          <div className="py-2 border-b">
            <h1 className="text-3xl font-semibold text-gray-800">
              Product Information
            </h1>
          </div>
          <div className="">
            <div>
              <p className="text-lg text-gray-600 mb-2">
                <span className="font-medium">Product Name:</span>{" "}
                {product.name}
              </p>
              <p className="text-lg text-gray-600 mb-2">
                <span className="font-medium">Product Price:</span>{" "}
                {formatAmountDefault("GBP", product.price)}
              </p>
              {product.previousPrice && (
                <p className="text-lg text-gray-600 mb-2">
                  <span className="font-medium">Product Previous Price:</span>{" "}
                  {formatAmountDefault("GBP", product.previousPrice)}
                </p>
              )}
              <p className="text-lg text-gray-600 mb-2">
                <span className="font-medium">Product Gender Type:</span>{" "}
                {product.gender}
              </p>
              <p className="text-lg text-gray-600 mb-2">
                <span className="font-medium">Product Type:</span>{" "}
                {product.type}
              </p>
              <p className="text-lg text-gray-600 mb-2">
                <span className="font-medium">Product Category:</span>{" "}
                {product.category}
              </p>
              <p className="text-lg text-gray-600 mb-2">
                <span className="font-medium">Product Sub-Category:</span>{" "}
                {product.subcategory || "N/A"}
              </p>

              <p className="text-lg text-gray-600 mb-2 flex gap-2">
                <span className="font-medium">Product Color:</span>{" "}
                <div className="flex flex-wrap gap-1">
                  {product.colors.map((color: any, index: any) => (
                    <p key={index}>{color},</p>
                  ))}
                </div>
              </p>
            </div>

            <div>
              <div className="mb-2">
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  Available Sizes:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size: any, index: number) => (
                    <span
                      key={index}
                      className="w-14 h-14 flex items-center justify-center py-1 bg-gray-100 text-text-primary text-sm border poppins"
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
              <p className="text-lg text-gray-600 mb-2">
                <span className="font-medium">Date Created:</span>{" "}
                {product.createdAt?.split("").slice(0, 10)}{" "}
                {product.createdAt?.split("").slice(11, 19)}
              </p>
              <p className="text-lg text-gray-600 mb-2">
                <span className="font-medium">Number Of Reviews:</span>{" "}
                {product.reviews.length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminProductDetails;
