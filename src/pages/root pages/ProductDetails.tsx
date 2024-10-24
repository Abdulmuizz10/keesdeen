import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useShop } from "../../context/ShopContext";
import { FaStar } from "react-icons/fa";
import { FaStarHalfAlt } from "react-icons/fa";
import { formatAmount } from "../../lib/utils";
import { Button } from "@relume_io/relume-ui";
import RelatedProducts from "../../components/RelatedProducts";
import Reviews from "../../components/Reviews";

interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  size: string[];
  color: string;
  rating: number;
  reviews: number;
  isAvailable: boolean;
  material: string;
  gender: string;
  imageUrl: string[];
  description: string;
}

const ProductDetails: React.FC = () => {
  const { id } = useParams();
  const { products, addToCart } = useShop();
  const [productData, setProductData] = useState<Product>();
  const [image, setImage] = useState<string>("");
  const [size, setSize] = useState<string>();
  const location = useLocation();

  const fetchProductData = async () => {
    const productResult = products.find((product) => {
      return product.id === Number(id);
    });
    setProductData(productResult);
    if (productResult) {
      setImage(productResult.imageUrl[0]);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProductData();
  }, [id, location.pathname]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return productData ? (
    <section id="relume" className="px-[5%] py-24 md:py-30">
      <div className="container">
        <div className="flex gap-5 md:gap-10 flex-col lg:flex-row">
          {/* Product images */}
          <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
            <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal no-scrollbar">
              {productData.imageUrl.map((item, index) => (
                <img
                  src={item}
                  alt="product images"
                  key={index}
                  className="w-[24%] max-lg:h-[25%] sm:w-[110px] sm:mb-3 flex-shrink-0 cursor-pointer"
                  onClick={() => setImage(item)}
                />
              ))}
            </div>
            <div className="w-full sm:w-[80%]">
              <img
                src={image}
                alt="product image"
                className="w-full max-xl:h-full h-auto"
              />
            </div>
          </div>
          {/* Product Details */}
          <div className="flex-1">
            <h2 className="rb-5 mb-2 text-2xl font-bold md:mb-4 md:text-4xl lg:text-5xl bricolage-grotesque">
              {productData.name}
            </h2>
            <div className="flex items-center gap-1 mt-2">
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStarHalfAlt />
              <p className="pl-2">(122)</p>
            </div>
            <p className="mt-5 text-3xl font-medium">
              {formatAmount(productData.price)}
            </p>
            <p className="mt-5 text-gray-500">{productData.description}</p>
            <div className="flex flex-col gap4 my-8">
              <p className="mb-2">Select size</p>
              <div className="flex gap-2">
                {productData.size.map((item, index) => (
                  <div
                    className={`p-2 h-[40px] w-[40px] bg-gray-300 flex items-center justify-center cursor-pointer poppins text-sm ${
                      item === size && "border-2 border-border-primary"
                    }`}
                    key={index}
                    onClick={() => setSize(item)}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <Button
              className=" active:bg-gray-700 rounded-md bg-brand-neutral text-text-light border-none"
              onClick={() => addToCart(productData?.id, size)}
            >
              ADD TO CART
            </Button>
            <hr className="mt-8 sm:w-4/5" />
            <div
              className="text-base text-text-secondary mt-5 flex flex-col gap-1
            "
            >
              <p>100% Original product.</p>
            </div>
          </div>
        </div>
        {/* Description and Review Section */}
        <div className="mt-20">
          <Reviews />
        </div>

        {/* Related products */}
        <div className="mt-20">
          {productData && <RelatedProducts category={productData.category} />}
        </div>
      </div>
    </section>
  ) : null;
};

export default ProductDetails;
