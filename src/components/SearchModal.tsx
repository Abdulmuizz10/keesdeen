import React, { useState } from "react";
import { motion } from "framer-motion";
import { background } from "../lib/anim";
import { useShop } from "../context/ShopContext";
import { CiSearch } from "react-icons/ci";
import { Link } from "react-router-dom";
import { FiX } from "react-icons/fi";
import Axios from "axios";
import { URL } from "../lib/constants";
import ProductItem from "./ProductItem";

const SearchModal: React.FC = () => {
  const { isActive, setIsActive } = useShop();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (searchQuery.trim() === "") {
      setResults([]);
      setSuggestions([]);
      return;
    }
    try {
      const { data } = await Axios.get(`${URL}/products/suggestions`, {
        params: { query: searchQuery },
      });
      setResults(data.products);
      setSuggestions(data.suggestions);
    } catch (error) {
      console.error("Error searching for products:", error);
    }
  };

  return (
    <motion.div
      variants={background}
      initial="initial"
      animate={isActive ? "open" : "closed"}
      className={`bg-background-light h-[120vh] w-screen fixed top-0 left-0 right-0 bottom-0 z-[1000px] flex justify-center border-b border-border-secondary overflow-y-auto ${
        searchQuery.length === 0 ? "items-center" : "items-start"
      }`}
    >
      <FiX
        className="text-2xl cursor-pointer text-text-primary my-2 absolute max-lg:top-2 max-lg:left-3 top-3 right-6"
        onClick={() => {
          setIsActive(!isActive);
          setSearchQuery("");
          setResults([]);
          setSuggestions([]);
        }}
      />

      {isActive && (
        <div className="container mt-10 px-9">
          <div className="w-full">
            <div className="w-full flex flex-col items-center">
              <div className="flex items-center justify-center w-full border-b border-border-secondary  outline-none gap-2">
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
                    setSearchQuery("");
                    setResults([]);
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
                        <Link to={`/collections/${suggestion}`} key={index}>
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
                        {results?.map((product: any, index: number) => (
                          <ProductItem product={product} key={index} />
                        ))}
                      </div>
                      {results?.length < 1 && (
                        <div className="w-full flex justify-center">
                          <p className="text-xl text-center">
                            Product is not available...
                          </p>
                        </div>
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

export default SearchModal;
