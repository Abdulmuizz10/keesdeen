import React, { useState } from "react";
import { motion } from "framer-motion";
import { background } from "../lib/anim";
import { useShop } from "../context/ShopContext";
import { Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import Axios from "axios";
import { URL } from "../lib/constants";
import ProductCard from "./ProductCard";

const SearchModal: React.FC = () => {
  const { isActive, setIsActive } = useShop();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [products, setProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (searchQuery.trim() === "") {
      setProducts([]);
      setSuggestions([]);
      return;
    }

    try {
      const { data } = await Axios.get(
        `${URL}/products/search/suggestions-products`,
        {
          params: { query: searchQuery },
        }
      );
      setProducts(data.products);
      setSuggestions(data.suggestions);
    } catch (error) {
      setError("Network error, unable to get products!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      variants={background}
      initial="initial"
      animate={isActive ? "open" : "closed"}
      className={`bg-white h-[120vh] w-screen fixed inset-0 flex justify-center border-b border-border-secondary overflow-y-auto ${
        searchQuery.length === 0 ? "items-center" : "items-start"
      } ${isActive && "!z-50 "}`}
    >
      <X
        width={20}
        height={20}
        className="cursor-pointer text-text-primary my-2 absolute max-lg:top-2 max-lg:left-3 top-3 right-6"
        onClick={() => {
          setIsActive(!isActive);
          setSearchQuery("");
          setProducts([]);
          setSuggestions([]);
        }}
      />

      {isActive && (
        <div className="container mt-10 px-5 sm:px-10">
          <div className="w-full">
            <div className="w-full flex flex-col items-center">
              <div className="flex items-center justify-center w-full border-b border-border-secondary  outline-none gap-2">
                <Search
                  width={20}
                  height={20}
                  className="cursor-pointer text-text-primary my-2"
                />
                <input
                  type="text"
                  className="w-full bg-transparent focus:outline-none py-2 poppins"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search product..."
                />
                <X
                  width={20}
                  height={20}
                  className="cursor-pointer text-text-primary my-2"
                  onClick={() => {
                    setSearchQuery("");
                    setProducts([]);
                    setSuggestions([]);
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
                      {suggestions.map((suggestion: any, index: number) => (
                        <Link
                          to={`/collections/search/${suggestion}`}
                          key={index}
                        >
                          <li className="poppins text-md md:text-xl text-gray-500">
                            {suggestion}
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
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xxl:grid-cols-4 w-full gap-3 mb-10">
                        {products.length > 0 ? (
                          products?.map((product: any, index: number) => (
                            <ProductCard
                              product={product}
                              loading={loading}
                              key={index}
                            />
                          ))
                        ) : error ? (
                          <div className="col-span-4">
                            <p className="text-base sm:text-xl text-center mt-10 sm:mt-0">
                              {error}
                            </p>
                          </div>
                        ) : (
                          <div className="col-span-4">
                            <p className="text-base sm:text-xl text-center mt-10 sm:mt-0">
                              Products not available!
                            </p>
                          </div>
                        )}
                      </div>
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

export default SearchModal;
