import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useShop } from "../../context/ShopContext";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { RiHeartLine, RiHeartFill } from "react-icons/ri";
// import { ChevronLeft, ChevronRight } from "lucide-react";
import { BiArrowBack } from "react-icons/bi";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import RelatedProducts from "../../components/RelatedProducts";
import Reviews from "../../components/Reviews";
import Spinner from "../../components/Spinner";
import { currency, URL } from "../../lib/constants";
import Axios from "axios";
import { formatAmountDefault } from "../../lib/utils";
import { Share, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

const ProductDetails = () => {
  const { id } = useParams();
  const [result, setResult] = useState<any>();
  const navigate = useNavigate();
  const { addToCart, manageWishLists, wishLists } = useShop();
  const [size, setSize] = useState<string>();
  const [color, setColor] = useState<string>();
  const [animation, setAnimation] = useState<boolean>(false);
  const [error, setError] = useState("");

  if (!id) {
    navigate("/");
    return null;
  }

  useEffect(() => {
    setAnimation(true);
    const fetchData = async () => {
      try {
        const response = await Axios.get(
          `${URL}/products/collections/product/${id}`,
          {
            validateStatus: (status) => status < 600,
          }
        );
        if (response.status === 200) {
          setResult(response.data);
        } else {
          setError("Product does not exist!");
        }
      } catch (error) {
        setError("Unable to get product!");
      } finally {
        setAnimation(false);
      }
    };
    fetchData();
  }, [id]);

  const settings = {
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  const colorToHex = (colorName: string): string | null => {
    const colors: { name: string; code: string }[] = [
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

  return animation ? (
    <Animation />
  ) : (
    <section className="placing">
      {result ? (
        <div>
          {/* Product Grid */}
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Product Images - Left */}
            <div className="overflow-hidden">
              <Slider {...settings}>
                {result.product.imageUrls.map((item: string, index: number) => (
                  <div key={index} className="aspect-square">
                    <img
                      src={item}
                      alt={`${result.product.name} - ${index + 1}`}
                      className="h-full w-full object-cover"
                      loading="eager"
                    />
                  </div>
                ))}
              </Slider>
            </div>

            {/* Product Details - Right */}
            <div className="flex flex-col">
              {/* Brand */}
              <p className="mb-2 text-xs uppercase tracking-widest text-gray-500">
                {result.product.brand}
              </p>

              {/* Product Name */}
              <h1 className="mb-4 text-2xl font-light tracking-tight md:text-3xl">
                {result.product.name}
              </h1>

              {/* Reviews */}
              <div className="mb-6 flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, index) => {
                    const ratingValue = index + 1;
                    if (ratingValue <= Math.floor(result.averageRating)) {
                      return (
                        <FaStar
                          key={index}
                          className="text-sm text-yellow-500"
                        />
                      );
                    } else if (ratingValue <= result.averageRating) {
                      return (
                        <FaStarHalfAlt
                          key={index}
                          className="text-sm text-yellow-500"
                        />
                      );
                    } else {
                      return (
                        <FaRegStar
                          key={index}
                          className="text-sm text-yellow-500"
                        />
                      );
                    }
                  })}
                </div>
                <span className="text-sm text-gray-500">
                  {result.averageRating} ({result.totalReviews})
                </span>
              </div>

              {/* Price */}
              <div className="mb-8 flex items-center gap-3">
                {result.product.previousPrice && (
                  <span className="text-sm text-gray-400 line-through">
                    {formatAmountDefault(
                      currency,
                      result.product.previousPrice
                    )}
                  </span>
                )}
                <span className="text-xl font-light">
                  {formatAmountDefault(currency, result.product.price)}
                </span>
              </div>

              {/* Color Selection */}
              <div className="mb-8 border-t border-gray-100 pt-8">
                <p className="mb-4 text-xs uppercase tracking-widest text-gray-500">
                  Color
                </p>
                <div className="flex flex-wrap gap-3">
                  {result.product?.colors.map((option: any, index: number) => (
                    <label
                      key={index}
                      className={`flex cursor-pointer items-center gap-2 text-sm transition-opacity ${
                        color === option
                          ? "opacity-100"
                          : "opacity-45 hover:opacity-75"
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
                        className={`h-6 w-6 border ${
                          color === option
                            ? "border-2 border-gray-900"
                            : "border-gray-300"
                        }`}
                        style={{
                          backgroundColor: colorToHex(option) || "transparent",
                        }}
                      />
                      <span className="text-gray-900">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className="mb-8 border-t border-gray-100 pt-8">
                <p className="mb-4 text-xs uppercase tracking-widest text-gray-500">
                  Size
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.product.sizes.map((item: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSize(item)}
                      className={`flex h-12 w-12 items-center justify-center border text-sm transition-colors ${
                        item === size
                          ? "border-gray-900 bg-gray-900 text-white"
                          : "border-gray-300 bg-white text-gray-900 hover:border-gray-900"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mb-8 flex gap-3 border-t border-gray-100 pt-8">
                <button
                  onClick={() =>
                    addToCart(
                      result.product._id,
                      size,
                      color,
                      result.product.name,
                      result.product.price,
                      result.product.imageUrls[0]
                    )
                  }
                  className="flex-1 flex items-center justify-center gap-2 border border-gray-900 bg-gray-900 py-4 text-sm uppercase tracking-widest text-white transition-colors hover:bg-gray-800"
                >
                  Add to Cart <ShoppingBag width={20} height={20} />
                </button>
                <button
                  onClick={() => manageWishLists(result.product)}
                  className="flex h-[52px] w-[52px] items-center justify-center border border-gray-900 transition-colors hover:bg-gray-50"
                  aria-label="Add to wishlist"
                >
                  {wishLists.find(
                    (wish: any) => wish._id === result.product._id
                  ) ? (
                    <RiHeartFill className="text-2xl text-gray-900" />
                  ) : (
                    <RiHeartLine className="text-2xl text-gray-900" />
                  )}
                </button>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${window.location.origin}/product_details/${result.product._id}`
                    );
                    toast.success("Product link copied!");
                  }}
                  className="flex h-[52px] w-[52px] items-center justify-center border border-gray-900 transition-colors hover:bg-gray-50"
                  aria-label="Add to wishlist"
                >
                  <Share width={20} height={20} />
                </button>
              </div>

              {/* Description */}
              <div className="border-t border-gray-200 pt-8 text-sm leading-relaxed text-gray-600">
                <p className="mb-4 text-xs uppercase tracking-widest text-gray-500">
                  Description
                </p>
                <p>{result.product.description}</p>
                <p className="mt-4 text-xs text-gray-500">
                  100% Original product
                </p>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-16 md:mt-24">
            <Reviews id={id} />
          </div>

          {/* Related Products */}
          <div className="mt-16 md:mt-24">
            <RelatedProducts id={id} />
          </div>
        </div>
      ) : (
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-sm uppercase tracking-widest text-gray-400">
            {error}
          </p>
        </div>
      )}
    </section>
  );
};

// const SampleNextArrow = (props: any) => {
//   const { onClick } = props;
//   return (
//     <button
//       className="absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-gray-300 bg-white/90 transition-colors hover:border-gray-900 hover:bg-white"
//       onClick={onClick}
//       aria-label="Next image"
//     >
//       <ChevronRight size={20} strokeWidth={1.5} />
//     </button>
//   );
// };

// const SamplePrevArrow = (props: any) => {
//   const { onClick } = props;
//   return (
//     <button
//       className="absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-gray-300 bg-white/90 transition-colors hover:border-gray-900 hover:bg-white"
//       onClick={onClick}
//       aria-label="Previous image"
//     >
//       <ChevronLeft size={20} strokeWidth={1.5} />
//     </button>
//   );
// };

const SampleNextArrow = (props: any) => {
  const { onClick } = props;
  return (
    <div
      className="bg-gray-200 border border-border-primary w-14 h-14 rounded-full flex items-center justify-center right-2 top-[45%] absolute z-10 cursor-pointer"
      onClick={onClick}
    >
      <button className="next rotate-180">
        <BiArrowBack className="text-text-primary" />
      </button>
    </div>
  );
};

const SamplePrevArrow = (props: any) => {
  const { onClick } = props;
  return (
    <div
      className="bg-gray-200 border border-border-primary w-14 h-14 rounded-full flex items-center justify-center left-2 top-[45%] absolute z-10 cursor-pointer"
      onClick={onClick}
    >
      <button className="prev">
        <BiArrowBack className="text-text-primary" />
      </button>
    </div>
  );
};
const Animation = () => (
  <div className="flex h-screen items-center justify-center bg-white">
    <Spinner />
  </div>
);

export default ProductDetails;
