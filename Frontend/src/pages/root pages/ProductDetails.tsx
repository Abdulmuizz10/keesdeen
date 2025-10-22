import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useShop } from "../../context/ShopContext";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { RiHeartLine } from "react-icons/ri";
import { RiHeartFill } from "react-icons/ri";
import { BiArrowBack } from "react-icons/bi";
import { ShoppingBag } from "lucide-react";
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
        const response = await Axios.get(`${URL}/products/${id}`, {
          validateStatus: (status) => status < 600,
        });
        if (response.status === 200) {
          setResult(response.data);
        } else {
          setError("Product do not exist!");
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
    <section className="px-[5%] py-24 md:py-30">
      {result ? (
        <div className="container">
          <div className="flex flex-col gap-10 lg:flex-row">
            {/* Product images */}
            <div className="flex-1 w-full lg:w-1/2">
              <Slider {...settings}>
                {result?.product?.imageUrls.map(
                  (item: string, index: number) => (
                    <img
                      src={item}
                      alt="product images"
                      key={index}
                      className="w-full h-full"
                    />
                  )
                )}
              </Slider>
            </div>

            {/* Product Details */}
            <div className="flex-1 w-full">
              <div className="mb-2 md:mb-4">
                <h2 className="text-2xl font-bold mb-2 md:text-4xl lg:text-5xl bricolage-grotesque">
                  {result.product.name}
                </h2>
                <p>{result.product.brand}</p>
              </div>
              <div className="flex items-center gap-1 mt-2">
                {[...Array(5)].map((_, index) => {
                  const ratingValue = index + 1; // Ratings are 1-based
                  if (ratingValue <= Math.floor(result?.averageRating)) {
                    return (
                      <FaStar
                        key={index}
                        className="text-yellow-500 text-base"
                      />
                    ); // Full star
                  } else if (ratingValue <= result?.averageRating) {
                    return (
                      <FaStarHalfAlt
                        key={index}
                        className="text-yellow-500 text-base"
                      />
                    ); // Half star
                  } else {
                    return (
                      <FaRegStar
                        key={index}
                        className="text-yellow-500 text-base"
                      />
                    ); // Empty star
                  }
                })}
                <p className="pl-1 text-md font-medium">
                  ({result?.averageRating}) • {result?.totalReviews} reviews
                </p>
              </div>
              <div className="flex gap-2 items-center">
                {result?.product.previousPrice && (
                  <s className="mt-5 text-xl font-medium">
                    {formatAmountDefault(
                      currency,
                      result?.product.previousPrice
                    )}
                  </s>
                )}
                <p className="mt-5 text-2xl font-medium">
                  {formatAmountDefault(currency, result?.product.price)}
                </p>
              </div>

              {/* Color selection */}
              <div className="flex flex-col gap-4 my-8">
                <p className="mb-2">Select Color :</p>
                <div className="flex flex-wrap gap-3 md:gap-5 lg:gap-7 items-center">
                  {result?.product?.colors?.map(
                    (option: any, index: number) => (
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
                            backgroundColor:
                              colorToHex(option) || "transparent",
                          }}
                        ></span>
                        {option}
                      </label>
                    )
                  )}
                </div>
              </div>

              {/* Size selection */}
              <div className="flex flex-col gap-4 my-8">
                <p className="mb-2">Select Size :</p>
                <div className="flex flex-wrap gap-2">
                  {result?.product?.sizes?.map((item: any, index: number) => (
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
              <div className="flex items-center gap-2 lg:max-w-xs w-full">
                <Button
                  className="py-3.5 rounded-md flex items-center justify-center bg-brand-neutral text-text-light border-none flex-4 w-full poppins"
                  onClick={() =>
                    addToCart(
                      result?.product?._id,
                      size,
                      color,
                      result?.product?.name,
                      result?.product?.price,
                      result?.product?.imageUrls[0]
                    )
                  }
                >
                  Add To Cart <ShoppingBag />
                </Button>
                <div
                  className={`px-3 py-3 border-2 border-brand-neutral rounded-lg flex items-center justify-center cursor-pointer flex-1`}
                  onClick={() => manageWishLists(result?.product)}
                >
                  {wishLists.find(
                    (wish: any) => wish._id === result?.product._id
                  ) ? (
                    <RiHeartFill className="text-2xl text-brand-neutral" />
                  ) : (
                    <RiHeartLine className="text-2xl text-brand-neutral" />
                  )}
                </div>
              </div>
              <hr className="mt-8 sm:w-4/5" />
              <div className="text-base text-text-secondary mt-5 flex flex-col gap-1">
                <p>100% Original product.</p>
                <p className="mt-5 text-gray-500">
                  {result?.product?.description}
                </p>
              </div>
            </div>
          </div>

          {/* Description and Review Section */}
          <div className="mt-20">
            <Reviews id={id} />
          </div>
          {/* Related products */}
          <div className="mt-20">
            <RelatedProducts category={result?.product?.category} id={id} />
          </div>
        </div>
      ) : (
        <div className="h-[65vh] flex items-center justify-center">
          <p className="text-base sm:text-xl">{error}</p>
        </div>
      )}
    </section>
  );
};

// Rest of the component code remains the same...
const SampleNextArrow = (props: any) => {
  const { onClick } = props;
  return (
    <div
      className="bg-gray-200 border border-border-primary w-14 h-14 rounded-full flex items-center justify-center -right-3 sm:-right-6 top-[45%] absolute z-10 cursor-pointer"
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
      className="bg-gray-200 border border-border-primary w-14 h-14 rounded-full flex items-center justify-center -left-3 sm:-left-6 top-[45%] absolute z-10 cursor-pointer"
      onClick={onClick}
    >
      <button className="prev">
        <BiArrowBack className="text-text-primary" />
      </button>
    </div>
  );
};

const Animation = () => (
  <div className="w-screen h-screen flex items-center justify-center bg-white">
    <Spinner />
  </div>
);

export default ProductDetails;
