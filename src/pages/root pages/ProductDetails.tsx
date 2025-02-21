import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useShop } from "../../context/ShopContext";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { RiHeartLine } from "react-icons/ri";
import { RiHeartFill } from "react-icons/ri";
import { BiArrowBack } from "react-icons/bi";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { Button } from "@relume_io/relume-ui";
import RelatedProducts from "../../components/RelatedProducts";
import Reviews from "../../components/Reviews";
import Spinner from "../../components/Spinner";
import { URL } from "../../lib/constants";
import Axios from "axios";

const ProductDetails = () => {
  const { id } = useParams();
  const [animation, setAnimation] = useState<boolean>(true);
  const [result, setResult] = useState<any>();
  const navigate = useNavigate();
  const {
    addToCart,
    currentCurrency,
    manageWishLists,
    wishLists,
    formatAmount,
  } = useShop();
  const [size, setSize] = useState<string>();
  const [color, setColor] = useState<string>();

  if (!id) {
    navigate("/");
    return null;
  }

  useEffect(() => {
    setAnimation(true);
    const fetchData = async () => {
      const response = await Axios.get(`${URL}/products/${id}`);
      setResult(response.data);
      setTimeout(() => setAnimation(false), 3000);
    };
    fetchData();
  }, [id, currentCurrency]);

  const settings = {
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  return animation ? (
    <Animation />
  ) : (
    <section className="px-[5%] py-24 md:py-30">
      {result && (
        <div className="container">
          <div className="flex gap-10 flex-col lg:flex-row">
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
                    {formatAmount(result?.product.previousPrice)}
                  </s>
                )}
                <p className="mt-5 text-2xl font-medium">
                  {formatAmount(result?.product.price)}
                </p>
              </div>

              {/* Color selection */}
              <div className="flex flex-col gap-4 my-8">
                <p className="mb-2">Select Color :</p>
                <div className="flex flex-wrap gap-5 md:gap-7 lg:gap-10 items-center">
                  {result?.product?.colors?.map(
                    (option: any, index: number) => (
                      <label
                        key={index}
                        className={`flex items-center gap-2 cursor-pointer ${
                          color === option && "font-bold"
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
                          className={`w-8 h-8 rounded-full border-2 transition-all ${
                            color === option &&
                            "border-border-secondary !h-4 !w-4"
                          }`}
                          style={{ backgroundColor: option.toLowerCase() }}
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
                  className="active:bg-gray-700 py-3.5 rounded-md flex items-center justify-center bg-brand-neutral text-text-light border-none flex-4 w-full"
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
                  ADD TO CART
                </Button>
                <div
                  className={`px-3 py-3 border-2 border-border-primary rounded-lg flex items-center justify-center cursor-pointer flex-1`}
                  onClick={() => manageWishLists(result?.product)}
                >
                  {wishLists.find(
                    (wish: any) => wish._id === result?.product._id
                  ) ? (
                    <RiHeartFill className="text-2xl text-text-primary" />
                  ) : (
                    <RiHeartLine className="text-2xl text-text-secondary" />
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

// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import { useShop } from "../../context/ShopContext";
// import { FaStar, FaStarHalfAlt } from "react-icons/fa";
// import { formatAmount } from "../../lib/utils";
// import { Button } from "@relume_io/relume-ui";
// import RelatedProducts from "../../components/RelatedProducts";
// import Reviews from "../../components/Reviews";
// import { useProducts } from "../../context/ProductContext/ProductContext";
// import { getProduct } from "../../context/ProductContext/ProductApiCalls";
// import Spinner from "../../components/Spinner";

// type RouteParams = {
//   id: string;
// };

// const ProductDetails: React.FC = ({}) => {
//   const { id } = useParams<RouteParams>();
//   const { products, product, dispatch } = useProducts();
//   const [animation, setAnimation] = useState<boolean>(true);
//   const navigate = useNavigate();
//   const { addToCart } = useShop();
//   const [image, setImage] = useState<string>("");
//   const [size, setSize] = useState<string>();
//   const location = useLocation();

//   if (!id) {
//     navigate("/");
//     return null;
//   }

//   useEffect(() => {
//     getProduct(id, dispatch);
//     setTimeout(() => {
//       setAnimation(false);
//     }, 3000);
//   }, [id, location.pathname]);

//   useEffect(() => {
//     setTimeout(() => {
//       setAnimation(false);
//     }, 3000);
//   }, []);

//   useEffect(() => {
//     if (product && product.imageUrls?.length > 0) {
//       setImage(product.imageUrls[0]);
//     }
//     window.scrollTo(0, 0);
//   }, [product]);

//   return (
//     product && (
//       <section id="relume" className="px-[5%] py-24 md:py-30">
//         {animation && <Animation />}
//         <div className="container">
//           <div className="flex gap-5 md:gap-10 flex-col lg:flex-row">
//             {/* Product images */}
//             <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
//               <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal no-scrollbar">
//                 {product &&
//                   product?.imageUrls
//                     ?.slice(1, 5)
//                     .map((item: string, index: number) => (
//                       <img
//                         src={item}
//                         alt="product images"
//                         key={index}
//                         className="w-[24%] max-lg:h-[25%] sm:w-[110px] sm:mb-3 flex-shrink-0 cursor-pointer"
//                         onClick={() => setImage(item)}
//                       />
//                     ))}
//               </div>
//               <div className="w-full sm:w-[80%]">
//                 <img
//                   src={image}
//                   alt="product image"
//                   className="w-full max-xl:h-full h-auto"
//                   onClick={() => setImage(product.imageUrls[0])}
//                 />
//               </div>
//             </div>
//             {/* Product Details */}
//             <div className="flex-1">
//               <h2 className="rb-5 mb-2 text-2xl font-bold md:mb-4 md:text-4xl lg:text-5xl bricolage-grotesque">
//                 {product?.name}
//               </h2>
//               <div className="flex items-center gap-1 mt-2">
//                 <FaStar />
//                 <FaStar />
//                 <FaStar />
//                 <FaStar />
//                 <FaStarHalfAlt />
//                 <p className="pl-2">({product && product?.reviews?.length})</p>
//               </div>
//               <p className="mt-5 text-3xl font-medium">
//                 {formatAmount(product?.price)}
//               </p>
//               <p className="mt-5 text-gray-500">{product?.description}</p>
//               <div className="flex flex-col gap4 my-8">
//                 <p className="mb-2">Select size</p>
//                 <div className="flex gap-2">
//                   {product &&
//                     product?.size?.map((item: string, index: number) => (
//                       <div
//                         className={`p-2 h-[40px] w-[40px] bg-gray-300 flex items-center justify-center cursor-pointer poppins text-sm ${
//                           item === size && "border-2 border-border-primary"
//                         }`}
//                         key={index}
//                         onClick={() => setSize(item)}
//                       >
//                         {item}
//                       </div>
//                     ))}
//                 </div>
//               </div>
//               <Button
//                 className="active:bg-gray-700 rounded-md bg-brand-neutral text-text-light border-none"
//                 onClick={() => addToCart(product._id, size)}
//               >
//                 ADD TO CART
//               </Button>
//               <hr className="mt-8 sm:w-4/5" />
//               <div className="text-base text-text-secondary mt-5 flex flex-col gap-1">
//                 <p>100% Original product.</p>
//               </div>
//             </div>
//           </div>
//           {/* Description and Review Section */}
//           <div className="mt-20">
//             <Reviews id={product._id} />
//           </div>

//           {/* Related products */}
//           <div className="mt-20">
//             {products && product && (
//               <RelatedProducts category={product.category} id={product._id} />
//             )}
//           </div>
//         </div>
//       </section>
//     )
//   );
// };

// const Animation = () => {
//   return (
//     <div className="w-full h-[110vh] flex items-center justify-center bg-white absolute top-0 left-0 right-0 no-scrollbar">
//       <Spinner />
//     </div>
//   );
// };
// export default ProductDetails;
