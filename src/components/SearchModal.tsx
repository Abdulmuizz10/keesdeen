import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { background } from "../lib/anim";
import { useShop } from "../context/ShopContext";
import { CiSearch } from "react-icons/ci";
import { Link } from "react-router-dom";
import { formatAmount } from "../lib/utils";
import { FiX } from "react-icons/fi";
import { useMediaQuery } from "@relume_io/relume-ui";
import { getProducts } from "../context/ProductContext/ProductApiCalls";
import { useProducts } from "../context/ProductContext/ProductContext";

const SearchModal: React.FC = () => {
  const { isActive, setIsActive } = useShop();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredProducts, setFilteredProducts] = useState<any>([]);
  const { products, dispatch } = useProducts();

  useEffect(() => {
    getProducts(dispatch);
  }, [dispatch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    const filteredProds = products?.filter(
      (product) =>
        product.name.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1
    );
    setFilteredProducts(filteredProds);
  };

  const isIpad = useMediaQuery("(max-width: 1024px)");

  return (
    <motion.div
      variants={background}
      initial="initial"
      animate={isActive ? "open" : "closed"}
      className={`bg-background-light h-screen w-screen fixed top-0 left-0 right-0 bottom-0 z-[1000px] flex  justify-center border-b border-border-secondary max-lg:overflow-y-auto ${
        searchQuery.length === 0 ? "items-center" : "items-start"
      }`}
    >
      {isActive && (
        <div className="container mt-10 px-9">
          <div className="w-full">
            <div className="w-full flex flex-col items-center">
              <div className="max-w-xxl flex items-center justify-center w-full border-b border-border-secondary  outline-none gap-2">
                <CiSearch className="text-3xl cursor-pointer text-text-primary my-2" />
                <input
                  type="text"
                  className="w-full bg-transparent focus:outline-none py-2 poppins"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search product..."
                />
                <FiX
                  className="text-2xl cursor-pointer text-text-primary my-2"
                  onClick={() => {
                    setIsActive(!isActive);
                    setSearchQuery("");
                  }}
                />
              </div>
              {searchQuery.length > 1 && (
                <div className="w-full flex flex-col justify-start lg:flex-row mt-5 gap-10">
                  <div className=" w-full lg:w-1/5">
                    <div className="w-full mb-4">
                      <div>
                        <p className="text-black mb-3 font-medium">
                          Suggestions
                        </p>
                        <div className="h-[1px] w-full bg-border-secondary" />
                      </div>
                    </div>
                    <ul className="flex flex-col gap-2">
                      {filteredProducts &&
                        filteredProducts
                          .slice(-7)
                          .map((product: any, index: number) => (
                            <Link to={`/collections/${product.name}`}>
                              <li
                                key={index}
                                className="poppins text-md md:text-xl text-gray-500"
                              >
                                {product.name}
                              </li>
                            </Link>
                          ))}
                    </ul>
                  </div>
                  <div className="w-full lg:w-4/5 max-md:mb-10">
                    <div className="w-full mb-5">
                      <div>
                        <p className="text-black mb-3 font-medium">Products</p>
                        <div className="h-[1px] w-full bg-border-secondary" />
                      </div>
                    </div>
                    <div className="w-full">
                      <div className="hidden lg:grid lg:grid-cols-3 xl:grid-cols-4 w-full gap-3">
                        {filteredProducts &&
                          filteredProducts.length > 0 &&
                          filteredProducts
                            .slice(0, isIpad ? 3 : 4)
                            .map((product: any, index: number) => (
                              <LargeScreenSearchItem
                                product={product}
                                key={index}
                              />
                            ))}
                      </div>
                      {filteredProducts && filteredProducts.length < 1 && (
                        <div className="w-full flex justify-center">
                          <p className="text-xl text-center">
                            Product is not available...
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="w-full flex lg:hidden">
                      <div className="flex flex-col lg:hidden w-full gap-3 mb-10">
                        {filteredProducts &&
                          filteredProducts.length > 0 &&
                          filteredProducts
                            .slice(-5)
                            .map((product: any, index: number) => (
                              <SmallScreenSearchItem
                                product={product}
                                key={index}
                              />
                            ))}
                      </div>
                      {/* {filteredProducts && filteredProducts.length < 1 && (
                        <div className="w-full flex lg:hidden justify-center">
                          <p className="text-xl text-center">
                            Product is not available...
                          </p>
                        </div>
                      )} */}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

const LargeScreenSearchItem = ({ product }: { product: any }) => {
  const [image, setImage] = useState<boolean>(false);
  const { isActive, setIsActive } = useShop();
  return (
    <div
      className="max-w-[250px] w-full mx-auto bg-white  shadow-large overflow-hidden relative"
      onMouseOver={() => setImage(true)}
      onMouseLeave={() => setImage(false)}
    >
      <div className="relative">
        <Link to={`/product_details/${product._id}`}>
          <img
            src={image ? product.imageUrls[1] : product.imageUrls[0]}
            alt="Product"
            className="w-full h-auto"
            onClick={() => {
              if (isActive === true) {
                setIsActive(!isActive);
              }
            }}
          />
        </Link>
      </div>
      <div className="p-2 text-center">
        <h3 className="text-md xl:text-lg font-semibold text-gray-800 bricolage-grotesque">
          {product.name}
        </h3>
        <p className="text-gray-500">{formatAmount(product.price)}</p>
      </div>
      <div className="mb-5">
        <div className="flex flex-wrap gap-1 items-center justify-center">
          {["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"].map(
            (size) => (
              <button
                key={size}
                className={`border border-gray-300 rounded-sm text-gray-600 text-[10px] px-1 py-1 h-6 w-8 hover:bg-gray-100 transition poppins ${
                  product.sizes.includes(size) ? "" : "opacity-[0.3]"
                }`}
              >
                {size}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

const SmallScreenSearchItem = ({ product }: { product: any }) => {
  return (
    <Link to={`/product_details/${product._id}`}>
      <div className="w-full flex gap-5 md:gap-2">
        <div className="w-1/5">
          <img src={product.imageUrls[0]} alt="" className="w-[120px] h-auto" />
        </div>
        <div className="w-4/5">
          <h3>{product.name}</h3>
          <p>{formatAmount(product.price)}</p>
        </div>
      </div>
    </Link>
  );
};
export default SearchModal;
