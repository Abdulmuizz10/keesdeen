import React, { useEffect, useState } from "react";
import { RxChevronDown } from "react-icons/rx";
import { useShop } from "../../context/ShopContext";
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@relume_io/relume-ui";
import ProductItem from "../../components/ProductItem";
import { useLocation } from "react-router-dom";

const Collections: React.FC = () => {
  // Define the type for a clothing product
  interface ClothingProduct {
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
  // const { name }: { name: any } = useParams();
  const { products } = useShop();
  const [showFilter, setShowFilter] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState<ClothingProduct[]>(
    []
  );
  const [category, setCategory] = useState<string[]>([]);
  const [sizeCategory, setSizeCategory] = useState<string[]>([]);
  const [colorCategory, setColorCategory] = useState<string[]>([]);
  const [sortType, setSortType] = useState<string>("Relevance");

  const toggleCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (category.includes(e.target.value)) {
      setCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setCategory((prev) => [...prev, e.target.value]);
    }
  };

  const toggleSizeCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (sizeCategory.includes(e.target.value)) {
      setSizeCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setSizeCategory((prev) => [...prev, e.target.value]);
    }
  };

  const toggleColorCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (colorCategory.includes(e.target.value)) {
      setColorCategory((prev) =>
        prev.filter((item) => item !== e.target.value)
      );
    } else {
      setColorCategory((prev) => [...prev, e.target.value]);
    }
  };

  const applyFilter = () => {
    let productsCopy = products.slice();

    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category)
      );
    }

    if (sizeCategory.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        sizeCategory.includes(item.size)
      );
    }

    if (colorCategory.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        colorCategory.includes(item.color)
      );
    }

    setFilteredProducts(productsCopy);
  };

  const clearFilters = () => {
    // toggleCategory();
    // toggleSizeCategory();
    // toggleColorCategory();
    setCategory([]);
    setSizeCategory([]);
    setColorCategory([]);
  };

  const sortProducts = () => {
    let spCopy = filteredProducts.slice();

    switch (sortType) {
      case "Low - High":
        setFilteredProducts(spCopy.sort((a, b) => a.price - b.price));
        break;
      case "High - Low":
        setFilteredProducts(spCopy.sort((a, b) => b.price - a.price));
        break;
      default: {
        applyFilter();
        break;
      }
    }
  };

  useEffect(() => {
    applyFilter();
  }, [category, sizeCategory, colorCategory]);

  useEffect(() => {
    sortProducts();
  }, [sortType]);

  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-10">
      <div className="container">
        <div className="rb-12 mb-12 md:mb-5">
          <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl bricolage-grotesque">
            Shop All
          </h2>
          <p className="md:text-md">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-5 sm:gap-10 pt-5 border-t border-border-primary">
          {/* Left Side */}
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

            {/* Category Filter */}
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
                        onChange={toggleCategory}
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
                      onChange={toggleSizeCategory}
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
              <p className="text-base md:text-md pb-1">Colour</p>
              <div className="flex flex-col gap-2 text-sm font-light text-text-primary">
                {[
                  "Black",
                  "Blue",
                  "Brown",
                  "Cream",
                  "Green",
                  "Grey",
                  "Pink",
                  "Purple",
                  "Red",
                  "White",
                ].map((color, index) => (
                  <p className="flex gap-2 items-center">
                    <input
                      type="checkbox"
                      className="w-3"
                      value={color}
                      key={index}
                      onChange={toggleColorCategory}
                    />
                    <div
                      style={{ background: color }}
                      className={`h-3 w-3 rounded-full ${
                        color === "WHITE" || "CREAM"
                          ? "border border-border-primary"
                          : ""
                      }`}
                    ></div>
                    {color}
                  </p>
                ))}
              </div>
            </div>
            <Button
              className="my-2 w-full"
              variant="secondary"
              onClick={clearFilters}
            >
              Clear filter
            </Button>
          </div>
          {/* Right Side */}
          <div className="flex-1 flex flex-col gap-5 w-full">
            <div className="flex justify-between text-base items-center">
              <h3 className="text-base md:text-md">All Collections</h3>
              {/* {Product Sort} */}
              {/* <select className="border-2 border-border-secondary py-2 px-2 rounded-md">
                <option value="relevant">Sort by: Relevance</option>
                <option value="low - high">Sort by: Low to High</option>
                <option value="high - low">Sort by: High to Low</option>
              </select> */}

              <p className="info-text hidden xl:flex">
                Showing 1 . {filteredProducts.length} of 31 Products
              </p>

              <div className="md:max-w-xxs max-w-[200px] w-full">
                <Select onValueChange={setSortType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by price" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevant">Sort by: Relevance</SelectItem>
                    <SelectItem value="Low - High">
                      Sort by: Low to High
                    </SelectItem>
                    <SelectItem value="High - Low">
                      Sort by: High to Low
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {/* {Map Products} */}
            <div className="grid gird-cols md:grid-cols-1 lg:grid-cols-3 xxl:grid-cols-4 gap-4 gap-y-6">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
                  <ProductItem product={product} key={index} />
                ))
              ) : (
                <ProductUnavailable />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ProductUnavailable = () => {
  return (
    <p className="text-center text-xl w-full">Product is not available...</p>
  );
};
export default Collections;
