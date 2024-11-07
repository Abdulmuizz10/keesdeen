import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useShop } from "../../context/ShopContext";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { formatAmount } from "../../lib/utils";
import { Button } from "@relume_io/relume-ui";
import RelatedProducts from "../../components/RelatedProducts";
import Reviews from "../../components/Reviews";
import { useProducts } from "../../context/ProductContext/ProductContext";
import { getProduct } from "../../context/ProductContext/ProductApiCalls";
import Spinner from "../../components/Spinner";
import { Product } from "../../lib/types";

interface ProductListProps {
  products: Product[];
}

const ProductDetails: React.FC<ProductListProps> = ({ products }) => {
  const { id } = useParams();
  const { product, dispatch } = useProducts();
  const [animation, setAnimation] = useState<boolean>(true);
  const [result, setResult] = useState<Product>();
  const navigate = useNavigate();
  const { addToCart } = useShop();
  const [image, setImage] = useState<string>("");
  const [size, setSize] = useState<string>();

  if (!id) {
    navigate("/");
    return null;
  }

  useEffect(() => {
    setAnimation(true);
    window.scrollTo(0, 0);
    const fetchData = async () => {
      await getProduct(id, dispatch);
      const productResult = await products.find((p) => p._id === id);
      setResult(productResult);
      // setAnimation(false);
      setTimeout(() => setAnimation(false), 3000);
    };
    fetchData();
    setTimeout(() => setAnimation(false), 4000);
  }, [id, dispatch]);

  useEffect(() => {
    if (product?.imageUrls?.length) {
      setImage(product.imageUrls[0]);
    }
  }, [product]);

  return (
    result && (
      <section id="relume" className="px-[5%] py-24 md:py-30">
        {animation && <Animation />}
        <div className="container">
          <div className="flex gap-5 md:gap-10 flex-col lg:flex-row">
            {/* Product images */}
            <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
              <div
                className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll
                justify-between sm:justify-normal no-scrollbar"
              >
                {result?.imageUrls
                  ?.slice(1, 5)
                  .map((item: string, index: number) => (
                    <img
                      src={item}
                      alt="product images"
                      key={index}
                      className="w-[24%] max-lg:h-[25%] sm:w-[110px] sm:mb-3 cursor-pointer"
                      onClick={() => setImage(item)}
                    />
                  ))}
              </div>
              <div className="w-full sm:w-[80%]">
                <img
                  src={image}
                  alt="product image"
                  className="w-full max-xl:h-full h-auto"
                  onClick={() => setImage(result?.imageUrls[0])}
                />
              </div>
            </div>
            {/* Product Details */}
            <div className="flex-1">
              <h2 className="rb-5 mb-2 text-2xl font-bold md:mb-4 md:text-4xl lg:text-5xl bricolage-grotesque">
                {result.name}
              </h2>
              <div className="flex items-center gap-1 mt-2">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStarHalfAlt />
                <p className="pl-2">({result?.reviews?.length})</p>
              </div>
              <p className="mt-5 text-3xl font-medium">
                {formatAmount(result.price)}
              </p>
              <p className="mt-5 text-gray-500">{result.description}</p>
              <div className="flex flex-col gap-4 my-8">
                <p className="mb-2">Select size</p>
                <div className="flex gap-2">
                  {result?.size?.map((item: any, index: number) => (
                    <div
                      className={`p-2 h-[40px] w-[40px] bg-gray-300 flex items-center justify-center cursor-pointer text-sm ${
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
                className="active:bg-gray-700 rounded-md bg-brand-neutral text-text-light border-none"
                onClick={() => addToCart(result._id, size)}
              >
                ADD TO CART
              </Button>
              <hr className="mt-8 sm:w-4/5" />
              <div className="text-base text-text-secondary mt-5 flex flex-col gap-1">
                <p>100% Original product.</p>
              </div>
            </div>
          </div>
          {/* Description and Review Section */}
          <div className="mt-20">
            <Reviews id={result._id} />
          </div>
          {/* Related products */}
          <div className="mt-20">
            {products && (
              <RelatedProducts category={result.category} id={result._id} />
            )}
          </div>
        </div>
      </section>
    )
  );
};

const Animation = () => (
  <div className="w-screen h-[110vh] flex items-center justify-center bg-white fixed top-0 left-0 right-0 bottom-0">
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
