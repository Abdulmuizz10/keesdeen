import React, { useState } from "react";
import { motion } from "framer-motion";
import { background } from "../lib/anim";
import { useShop } from "../context/ShopContext";
import { CiSearch } from "react-icons/ci";
import { Link } from "react-router-dom";
import { formatAmount } from "../lib/utils";
import { FiX } from "react-icons/fi";

interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  size: string;
  color: string;
  rating: number;
  reviews: number;
  isAvailable: boolean;
  material: string;
  gender: string;
  imageUrl: string[];
  description: string;
}

const SearchModal: React.FC = () => {
  const { isActive, setIsActive, products } = useShop();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Filter suggestions
    //  const filteredSugg = suggestions.filter((suggestion) =>
    //    suggestion.toLowerCase().includes(query.toLowerCase())
    //  );
    //  setFilteredSuggestions(filteredSugg);

    // Filter products
    const filteredProds = products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filteredProds);
  };

  return (
    <motion.div
      variants={background}
      initial="initial"
      animate={isActive ? "open" : "closed"}
      className={`bg-[#ececec] h-screen w-screen fixed top-0 left-0 right-0 bottom-0 z-[1000px] flex  justify-center border-b border-border-secondary ${
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
                  className="w-full bg-transparent focus:outline-none  py-2"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search product..."
                />
                <FiX
                  className="text-2xl cursor-pointer text-text-primary my-2"
                  onClick={() => setIsActive(!isActive)}
                />
              </div>
              {searchQuery && (
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
                        filteredProducts.slice(-5).map((product, index) => (
                          <Link to={`/product_details/${product.id}`}>
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
                  <div className="w-full lg:w-4/5">
                    <div className="w-full mb-5">
                      <div>
                        <p className="text-black mb-3 font-medium">Products</p>
                        <div className="h-[1px] w-full bg-border-secondary" />
                      </div>
                    </div>
                    <div className="hidden lg:flex w-full gap-3">
                      {filteredProducts && filteredProducts.length > 0 ? (
                        filteredProducts
                          .slice(-4)
                          .map((product, index) => (
                            <LargeScreenSearchItem
                              product={product}
                              key={index}
                            />
                          ))
                      ) : (
                        <p className="text-xl lg:text-2xl">
                          Product is not available...
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col lg:hidden w-full gap-3">
                      {filteredProducts && filteredProducts.length > 0 ? (
                        filteredProducts
                          .slice(-3)
                          .map((product, index) => (
                            <SmallScreenSearchItem
                              product={product}
                              key={index}
                            />
                          ))
                      ) : (
                        <p className="text-xl lg:text-2xl">
                          Product is not available...
                        </p>
                      )}
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

const LargeScreenSearchItem = ({ product }: { product: Product }) => {
  const [image, setImage] = useState<boolean>(false);
  const { isActive, setIsActive } = useShop();
  return (
    <div
      className="max-w-[250px] w-full mx-auto bg-white  shadow-large overflow-hidden relative"
      onMouseOver={() => setImage(true)}
      onMouseLeave={() => setImage(false)}
    >
      <div className="relative">
        <Link to={`/product_details/${product.id}`}>
          <img
            src={image ? product.imageUrl[1] : product.imageUrl[0]}
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
      <div className="p-4 text-left">
        <h3 className="text-md xl:text-lg font-semibold text-gray-800 bricolage-grotesque">
          {product.name}
        </h3>
        <p className="text-gray-500">{formatAmount(product.price)}</p>
      </div>
    </div>
  );
};

const SmallScreenSearchItem = ({ product }: { product: Product }) => {
  return (
    <Link to={`/product_details/${product.id}`}>
      <div className="w-full flex gap-5 md:gap-2">
        <div className="w-1/5">
          <img src={product.imageUrl[0]} alt="" className="w-[120px] h-auto" />
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
