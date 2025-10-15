import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useShop } from "../../context/ShopContext";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { RiHeartLine, RiHeartFill } from "react-icons/ri";
import { BiArrowBack } from "react-icons/bi";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Button } from "@relume_io/relume-ui";
import RelatedProducts from "../../components/RelatedProducts";
import Reviews from "../../components/Reviews";
import Spinner from "../../components/Spinner";
import { currency, URL } from "../../lib/constants";
import Axios from "axios";
import { formatAmountDefault } from "../../lib/utils";

interface ProductData {
  _id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  previousPrice?: number;
  imageUrls: string[];
  sizes: string[];
  colors: string[];
  description: string;
}

interface ApiResponse {
  product: ProductData;
  averageRating: number;
  totalReviews: number;
}

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, manageWishLists, wishLists } = useShop();

  const [result, setResult] = useState<ApiResponse | null>(null);
  const [size, setSize] = useState<string>("");
  const [color, setColor] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        const response = await Axios.get(`${URL}/products/${id}`, {
          validateStatus: (status) => status < 600,
        });

        if (response.status === 200 && response.data?.product) {
          setResult(response.data);
        } else {
          setError("Product not found!");
        }
      } catch {
        setError("Unable to get product!");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const colorToHex = (colorName: string): string | null => {
    const colors = [
      { name: "Black", code: "#000000" },
      { name: "White", code: "#FFFFFF" },
      { name: "Gray", code: "#808080" },
      { name: "Blue", code: "#0000FF" },
      { name: "Red", code: "#FF0000" },
      { name: "Green", code: "#008000" },
      { name: "Yellow", code: "#FFFF00" },
      { name: "Pink", code: "#FFC0CB" },
      { name: "Brown", code: "#A52A2A" },
      { name: "Beige", code: "#F5F5DC" },
      { name: "Navy Blue", code: "#000080" },
      { name: "Burgundy", code: "#800020" },
      { name: "Sky Blue", code: "#87CEEB" },
    ];
    const color = colors.find(
      (c) => c.name.toLowerCase() === colorName.toLowerCase()
    );
    return color ? color.code : null;
  };

  const sliderSettings = {
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  if (loading) return <Animation />;

  if (error)
    return (
      <div className="h-[65vh] flex items-center justify-center">
        <p className="text-md text-gray-500">{error}</p>
      </div>
    );

  if (!result) return null;

  const { product, averageRating, totalReviews } = result;

  return (
    <section className="px-[5%] py-24 md:py-30">
      <div className="container">
        <div className="flex gap-10 flex-col lg:flex-row">
          {/* Product images */}
          <div className="flex-1 w-full lg:w-1/2">
            {Array.isArray(product.imageUrls) &&
            product.imageUrls.length > 0 ? (
              <Slider {...sliderSettings}>
                {product.imageUrls.map((item, index) => (
                  <img
                    src={item}
                    alt={`product image ${index + 1}`}
                    key={index}
                    className="w-full h-full object-cover"
                  />
                ))}
              </Slider>
            ) : (
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                alt="placeholder"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Product Details */}
          <div className="flex-1 w-full">
            <div className="mb-2 md:mb-4">
              <h2 className="text-2xl font-bold mb-2 md:text-4xl lg:text-5xl bricolage-grotesque">
                {product.name}
              </h2>
              <p>{product.brand}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 mt-2">
              {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                if (ratingValue <= Math.floor(averageRating))
                  return <FaStar key={index} className="text-yellow-500" />;
                else if (ratingValue <= averageRating)
                  return (
                    <FaStarHalfAlt key={index} className="text-yellow-500" />
                  );
                else
                  return <FaRegStar key={index} className="text-yellow-500" />;
              })}
              <p className="pl-1 text-md font-medium">
                ({averageRating}) • {totalReviews} reviews
              </p>
            </div>

            {/* Prices */}
            <div className="flex gap-2 items-center">
              {product.previousPrice && (
                <s className="mt-5 text-xl font-medium">
                  {formatAmountDefault(currency, product.previousPrice)}
                </s>
              )}
              <p className="mt-5 text-2xl font-medium">
                {formatAmountDefault(currency, product.price)}
              </p>
            </div>

            {/* Color selection */}
            {Array.isArray(product.colors) && product.colors.length > 0 && (
              <div className="flex flex-col gap-4 my-8">
                <p>Select Color :</p>
                <div className="flex flex-wrap gap-6 items-center">
                  {product.colors.map((option, index) => (
                    <label
                      key={index}
                      className={`flex items-center gap-2 cursor-pointer text-gray-500 poppins ${
                        color === option && "!font-bold !text-black"
                      }`}
                    >
                      <input
                        type="radio"
                        name="color"
                        value={option}
                        checked={color === option}
                        onChange={(e) => setColor(e.target.value)}
                        className="hidden"
                      />
                      <span
                        className={`w-3 h-3 rounded-full border-2 ${
                          color === option &&
                          "border-border-secondary !h-6 !w-6"
                        }`}
                        style={{
                          backgroundColor: colorToHex(option) || "transparent",
                        }}
                      ></span>
                      {option}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Size selection */}
            {Array.isArray(product.sizes) && product.sizes.length > 0 && (
              <div className="flex flex-col gap-4 my-8">
                <p>Select Size :</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((item, index) => (
                    <div
                      className={`p-2 h-[45px] w-[45px] bg-gray-200 flex items-center justify-center cursor-pointer text-sm poppins transition-all ${
                        item === size
                          ? "border-2 border-border-primary"
                          : "border border-border-secondary"
                      }`}
                      key={index}
                      onClick={() => setSize(item)}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart + Wishlist */}
            <div className="flex items-center gap-2 lg:max-w-xs w-full">
              <Button
                className="py-3.5 rounded-md bg-brand-neutral text-text-light w-full"
                onClick={() =>
                  addToCart(
                    product._id,
                    size,
                    color,
                    product.name,
                    product.price,
                    product.imageUrls?.[0] ??
                      "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                  )
                }
              >
                ADD TO CART
              </Button>
              <div
                className="px-3 py-3 border-2 border-brand-neutral rounded-lg cursor-pointer"
                onClick={() => manageWishLists(product)}
              >
                {wishLists.find((wish: any) => wish._id === product._id) ? (
                  <RiHeartFill className="text-2xl text-brand-neutral" />
                ) : (
                  <RiHeartLine className="text-2xl text-brand-neutral" />
                )}
              </div>
            </div>

            <hr className="mt-8 sm:w-4/5" />
            <div className="text-base text-text-secondary mt-5 flex flex-col gap-1">
              <p>100% Original product.</p>
              <p className="mt-5 text-gray-500">{product.description}</p>
            </div>
          </div>
        </div>

        {/* Reviews + Related Products */}
        <div className="mt-20">
          <Reviews id={id!} />
        </div>
        <div className="mt-20">
          <RelatedProducts category={product.category} id={id!} />
        </div>
      </div>
    </section>
  );
};

const SampleNextArrow = ({ onClick }: any) => (
  <div
    className="bg-gray-200 border border-border-primary w-14 h-14 rounded-full flex items-center justify-center -right-3 sm:-right-6 top-[45%] absolute z-10 cursor-pointer"
    onClick={onClick}
  >
    <button className="next rotate-180">
      <BiArrowBack className="text-text-primary" />
    </button>
  </div>
);

const SamplePrevArrow = ({ onClick }: any) => (
  <div
    className="bg-gray-200 border border-border-primary w-14 h-14 rounded-full flex items-center justify-center -left-3 sm:-left-6 top-[45%] absolute z-10 cursor-pointer"
    onClick={onClick}
  >
    <button className="prev">
      <BiArrowBack className="text-text-primary" />
    </button>
  </div>
);

const Animation = () => (
  <div className="w-screen h-screen flex items-center justify-center bg-white">
    <Spinner />
  </div>
);

export default ProductDetails;
