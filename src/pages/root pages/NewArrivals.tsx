import React, { useEffect, useState } from "react";
import { RxChevronDown } from "react-icons/rx";
import { useShop } from "../../context/ShopContext";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@relume_io/relume-ui";

const NewArrivals = () => {
  // Define the type for a clothing product
  interface ClothingProduct {
    id: number;
    name: string;
    brand: string;
    category: string;
    price: number;
    size: string[];
    color: string[];
    rating: number;
    reviews: number;
    isAvailable: boolean;
    material: string;
    gender: string;
    imageUrl: string;
  }

  const { products } = useShop();
  const [showFilter, setShowFilter] = useState(true);
  const [filterProducts, setFilterProducts] = useState<ClothingProduct[]>([]);

  useEffect(() => {
    setFilterProducts(products);
  });
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-10">
      <div className="container">
        <div className="rb-12 mb-12 md:mb-5">
          <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl bricolage-grotesque">
            New Arrivals
          </h2>
          <p className="md:text-md">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-5 sm:gap-10 pt-5 border-t border-border-primary">
          <div className="min-w-60">
            <div className="flex items-center gap-2">
              <p
                className="my-2 text-xl flex items-center cursor-pointer gap-2"
                onClick={() => setShowFilter(!showFilter)}
              >
                Filters
              </p>
              <RxChevronDown
                className={`text-2xl sm:hidden ${
                  showFilter ? "" : "rotate-180"
                }`}
              />
            </div>
            {/* Category Filter */}
            {/* <div
              className={`border border-border-tertiary pl-5 py-3 mt-5 ${
                showFilter ? "" : "hidden"
              } sm:block shadow-medium rounded`}
            >
              <p className="text-base md:text-md pb-1">Categories</p>
              <div className="flex flex-col gap-2 text-sm font-light text-text-primary">
                <p className="flex gap-2">
                  <input type="checkbox" className="w-3" value={"Men"} /> Men
                </p>
                <p className="flex gap-2">
                  <input type="checkbox" className="w-3" value={"Women"} />
                  Woman
                </p>
                <p className="flex gap-2">
                  <input type="checkbox" className="w-3" value={"Men"} /> Kids
                </p>
              </div>
            </div> */}

            {/* SubCategory Filter */}
            <div
              className={`border border-border-tertiary pl-5 py-3 mt-2 ${
                showFilter ? "" : "hidden"
              } sm:block shadow-medium rounded`}
            >
              <p className="text-base md:text-md pb-1">Type</p>
              <div className="flex flex-col gap-2 text-sm font-light text-text-primary">
                {["Top wear", "Bottom wear", "Inner wear"].map(
                  (wear, index) => (
                    <p className="flex gap-2">
                      <input
                        type="checkbox"
                        className="w-3"
                        value={wear}
                        key={index}
                      />
                      {wear}
                    </p>
                  )
                )}
              </div>
            </div>

            {/* Size Filter */}
            <div
              className={`border border-border-tertiary pl-5 py-3 mt-2 ${
                showFilter ? "" : "hidden"
              } sm:block shadow-medium rounded`}
            >
              <p className="text-base md:text-md pb-1">Size</p>
              <div className="flex flex-col gap-2 text-sm font-light text-text-primary">
                {[
                  "XXS",
                  "XS",
                  "S",
                  "M",
                  "L",
                  "XL",
                  "2XL",
                  "3XL",
                  "4XL",
                  "5XL",
                ].map((size, index) => (
                  <p className="flex gap-2">
                    <input
                      type="checkbox"
                      className="w-3"
                      value={size}
                      key={index}
                    />
                    {size}
                  </p>
                ))}
              </div>
            </div>

            {/* Color Filter */}
            <div
              className={`border border-border-tertiary pl-5 py-3 mt-2 ${
                showFilter ? "" : "hidden"
              } sm:block shadow-medium rounded`}
            >
              <p className="text-base md:text-md pb-1">Size</p>
              <div className="flex flex-col gap-2 text-sm font-light text-text-primary">
                {[
                  "BLACK",
                  "BLUE",
                  "BROWN",
                  "CREAM",
                  "GREEN",
                  "GREY",
                  "PINK",
                  "PURPLE",
                  "RED",
                  "WHITE",
                ].map((colour, index) => (
                  <p className="flex gap-2 items-center">
                    <input
                      type="checkbox"
                      className="w-3"
                      value={colour}
                      key={index}
                    />
                    <div
                      style={{ background: colour }}
                      className={`h-3 w-3 rounded-full ${
                        colour === "WHITE" || "CREAM"
                          ? "border border-border-primary"
                          : ""
                      }`}
                    ></div>
                    {colour}
                  </p>
                ))}
              </div>
            </div>
          </div>
          {/* Right Side */}
          <div className="flex-1 flex flex-col gap-5">
            <div className="flex justify-between text-base items-center">
              <h3 className="text-base md:text-md">All Arrivals</h3>
              {/* {Product Sort} */}
              {/* <select className="border-2 border-border-secondary py-2 px-2 rounded-md">
                <option value="relevant">Sort by: Relevance</option>
                <option value="low - high">Sort by: Low to High</option>
                <option value="high - low">Sort by: High to Low</option>
              </select> */}

              <div className="md:max-w-xxs max-w-[200px] w-full">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select one..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevant">Sort by: Relevance</SelectItem>
                    <SelectItem value="low - high">
                      Sort by: Low to High
                    </SelectItem>
                    <SelectItem value="high - low">
                      Sort by: High to Low
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {/* {Map Products} */}
            <div className="grid gird-cols md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4 gap-y-6">
              {filterProducts.map((product, index) => (
                <ClothingProductItem product={product} key={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Assuming you have the ClothingProduct type already defined

interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  size: string[];
  color: string[];
  rating: number;
  reviews: number;
  isAvailable: boolean;
  material: string;
  gender: string;
  imageUrl: string;
}

const ClothingProductItem = ({ product }: { product: Product }) => {
  return (
    <Link
      className="text-text-secondary cursor-pointer"
      to={`/product/${product.id}`}
    >
      <div className="overflow-hidden">
        <img
          src={product.imageUrl}
          alt="product image"
          className="transition ease-in-out hover:scale-110 w-full h-full"
        />
        <p className="pt-3 pb-1 text-sm">{product.name}</p>
        <p className=" font-medium text-sm">{product.price}</p>
      </div>
    </Link>
  );
};

export default NewArrivals;
