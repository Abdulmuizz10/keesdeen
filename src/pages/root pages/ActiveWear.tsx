import React, { useEffect, useRef, useState } from "react";
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
import { RiHeartLine } from "react-icons/ri";
import { RiHeartFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import Axios from "axios";
import { currency, URL } from "../../lib/constants";
import { formatAmountDefault } from "../../lib/utils";

const ActiveWear: React.FC = () => {
  const { isActive } = useShop();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await Axios.get(`${URL}/products/active-wears`, {
          validateStatus: (status) => status < 600,
        });

        if (res.status === 200) {
          setProducts(res.data);
          setFilteredProducts(res.data);
          setLoading(false);
        } else {
          // toast.error(res.data.message || "Something went wrong");
          setLoading(false);
        }
      } catch (error) {
        // toast.error("An unexpected error occurred. Please try again.");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const [showFilter, setShowFilter] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<any>([]);
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
    let productsCopy = products;

    if (category.length > 0) {
      productsCopy = productsCopy.filter((item: any) =>
        category.includes(item.subcategory)
      );
    }

    if (sizeCategory.length > 0) {
      productsCopy = productsCopy.filter((item: any) =>
        item.sizes.some((s: string) => sizeCategory.includes(s))
      );
    }

    if (colorCategory.length > 0) {
      productsCopy = productsCopy.filter((item: any) =>
        item.colors.some((c: string) => colorCategory.includes(c))
      );
    }

    setFilteredProducts(productsCopy);
  };

  const sortProducts = () => {
    let spCopy = filteredProducts.slice();

    switch (sortType) {
      case "Low - High":
        setFilteredProducts(spCopy.sort((a: any, b: any) => a.price - b.price));
        break;
      case "High - Low":
        setFilteredProducts(spCopy.sort((a: any, b: any) => b.price - a.price));
        break;
      default: {
        applyFilter();
        break;
      }
    }
  };

  useEffect(() => {
    applyFilter();
  }, [category, sizeCategory, colorCategory, products]);

  useEffect(() => {
    sortProducts();
  }, [sortType]);

  const checkboxesRef = useRef<HTMLInputElement[]>([]);

  const clearFilters = () => {
    setCategory([]);
    setSizeCategory([]);
    setColorCategory([]);
    checkboxesRef.current.forEach((checkbox) => (checkbox.checked = false));
  };

  return (
    <section className="px-[5%] py-24 md:py-30">
      <div className="container">
        <div className="mb-2 md:mb-5">
          <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl bricolage-grotesque text-gradient">
            Active Wear
          </h2>
          {/* <p className="md:text-md">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p> */}
        </div>
        <div
          className={`flex flex-col xl:flex-row gap-5 sm:gap-10 pt-5 border-t border-border-secondary ${
            isActive && "opacity-0 transition-opacity"
          }`}
        >
          {/* Left Side */}
          <div className="min-w-60 poppins">
            <div
              className="flex items-center gap-2"
              onClick={() => setShowFilter(!showFilter)}
            >
              <p className="my-2 text-xl flex items-center cursor-pointer gap-2">
                Filters
              </p>
              <RxChevronDown
                className={`text-2xl xl:hidden ${
                  showFilter ? "" : "rotate-180"
                }`}
              />
            </div>
            {/* category Filter */}
            <div
              className={`border border-border-secondary pl-5 py-3 mt-2 ${
                showFilter ? "" : "hidden"
              } xl:block shadow-medium rounded`}
            >
              <p className="text-base md:text-md pb-3">Product Type</p>
              <div className="flex flex-col gap-2 text-sm font-light text-text-primary">
                {[
                  "Modest Workout Tops",
                  "Joggers & Bottoms",
                  "Complete Active Wear Sets",
                  "High-Support Sports Bras",
                  "Sports Hijabs",
                  "Burkinis / Swimwear",
                ].map((wear, index) => (
                  <p className="flex gap-2" key={index}>
                    <input
                      type="checkbox"
                      className="w-3 cursor-pointer"
                      value={wear}
                      onChange={toggleCategory}
                      ref={(el) => {
                        if (el) checkboxesRef.current.push(el);
                      }}
                    />
                    {wear}
                  </p>
                ))}
              </div>
            </div>

            {/* Size Filter */}
            <div
              className={`border border-border-secondary pl-5 py-3 mt-2 ${
                showFilter ? "" : "hidden"
              } xl:block shadow-medium rounded`}
            >
              <p className="text-base md:text-md pb-3">Size</p>
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
                  <p className="flex gap-2" key={index}>
                    <input
                      type="checkbox"
                      className="w-3 cursor-pointer"
                      value={size}
                      onChange={toggleSizeCategory}
                      ref={(el) => {
                        if (el) checkboxesRef.current.push(el);
                      }}
                    />
                    {size}
                  </p>
                ))}
              </div>
            </div>

            {/* Color Filter */}
            <div
              className={`border border-border-secondary pl-5 py-3 mt-2 ${
                showFilter ? "" : "hidden"
              } xl:block shadow-medium rounded`}
            >
              <p className="text-base md:text-md pb-3">Colour</p>
              <div className="flex flex-col gap-2 text-sm font-light text-text-primary">
                {[
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
                ].map((color, index) => (
                  <p className="flex gap-2 items-center" key={index}>
                    <input
                      type="checkbox"
                      className="w-3 cursor-pointer"
                      value={color.name}
                      onChange={toggleColorCategory}
                      ref={(el) => {
                        if (el) checkboxesRef.current.push(el);
                      }}
                    />
                    <div
                      style={{ backgroundColor: color.code }}
                      className={`h-3 w-3 rounded-full ${
                        color.name === "White" || "Beige"
                          ? "border border-border-primary"
                          : ""
                      }`}
                    ></div>
                    {color.name}
                  </p>
                ))}
              </div>
            </div>
            <Button
              className={`my-4 w-full active:bg-brand-neutral/50 bg-brand-neutral text-text-light border-none rounded-md ${
                showFilter ? "" : "hidden"
              } xl:block`}
              variant="primary"
              onClick={() => {
                clearFilters();
              }}
            >
              Clear filter
            </Button>
          </div>
          {/* Right Side */}
          <div className="w-full">
            <div>
              <div className="flex-1 flex flex-col gap-5 w-full">
                <div className="flex justify-between text-base items-center">
                  <p className="text-base md:text-md">Active Wears</p>
                  {/* {Product Sort} */}

                  <p className="info-text hidden xl:flex">
                    Showing 1 . {filteredProducts.length} of {products?.length}{" "}
                    Products
                  </p>

                  <div className="md:max-w-xxs max-w-[200px] w-full hidden lg:flex">
                    <Select onValueChange={setSortType}>
                      <SelectTrigger className="rounded-md">
                        <SelectValue placeholder="Sort by price" />
                      </SelectTrigger>
                      <SelectContent className=" bg-background-light rounded-lg border border-border-secondary">
                        <SelectItem
                          value="relevant"
                          className=" cursor-pointer hover:text-text-secondary"
                        >
                          Sort by: Relevance
                        </SelectItem>
                        <SelectItem
                          value="Low - High"
                          className=" cursor-pointer  hover:text-text-secondary"
                        >
                          Sort by: Low to High
                        </SelectItem>
                        <SelectItem
                          value="High - Low"
                          className=" cursor-pointer  hover:text-text-secondary"
                        >
                          Sort by: High to Low
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className=" max-w-[200px] w-full flex lg:hidden">
                    <select
                      className="border-[0.5px] border-border-secondary bg-white py-2 px-4 rounded-sm"
                      onChange={(e) => setSortType(e.target.value)}
                    >
                      <option value="relevant">Sort by: Relevance</option>
                      <option value="Low - High">Sort by: Low to High</option>
                      <option value="High - Low">Sort by: High to Low</option>
                    </select>
                  </div>
                </div>
                {/* {Map Products} */}
                <div className="grid gird-cols-1 md:grid-cols-2 lg:grid-cols-3 xxl:grid-cols-4 gap-4 gap-y-6">
                  {loading ? (
                    Array(21)
                      .fill(null)
                      .map((product, index) => (
                        <ProductItem
                          key={index}
                          product={product}
                          loading={loading}
                          formatAmountDefault={formatAmountDefault}
                        />
                      ))
                  ) : filteredProducts.length > 0 ? (
                    filteredProducts?.map((product: any, index: number) => (
                      <ProductItem
                        key={index}
                        product={product}
                        loading={loading}
                        formatAmountDefault={formatAmountDefault}
                      />
                    ))
                  ) : (
                    <div className="sm:w-[700px] lg:w-[900px] xl:w-[850px] flex items-center justify-center">
                      <p className="text-base sm:text-xl text-center">
                        Products is not available
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

interface ProductProps {
  product: any;
  loading: Boolean;
  formatAmountDefault: any;
}

const ProductItem: React.FC<ProductProps> = ({
  product,
  loading,
  formatAmountDefault,
}) => {
  const [image, setImage] = useState<boolean>(false);
  const { manageWishLists, wishLists } = useShop();

  if (loading) {
    return (
      <div className="max-w-xs mx-auto bg-white shadow-large overflow-hidden relative z-[1]">
        <div className="relative">
          <div className="w-full h-[360px] bg-gray-200 animate-pulse" />
        </div>
        <div className="p-4 text-center">
          <div className="flex flex-col gap-2 items-center">
            <div className="h-6 w-full rounded bg-gray-200 animate-pulse" />
            <div className="flex gap-2 items-center justify-center">
              <div className="h-6 w-16 rounded bg-gray-200 animate-pulse" />
              <div className="h-6 w-16 rounded bg-gray-200 animate-pulse" />
            </div>
          </div>
          <div className="mt-2">
            <div className="flex flex-wrap gap-1 items-center justify-center">
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
              ].map((size) => (
                <button
                  key={size}
                  className="rounded-sm px-1 py-1 h-6 w-8 bg-gray-200 animate-pulse"
                ></button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="max-w-xs mx-auto bg-white  shadow-large overflow-hidden relative z-[1px] h-[500px]"
      onMouseOver={() => setImage(true)}
      onMouseLeave={() => setImage(false)}
    >
      <div className="absolute top-3 right-3 z-50 cursor-pointer">
        {wishLists.find((wish: any) => wish._id === product._id) ? (
          <RiHeartFill
            onClick={() => manageWishLists(product)}
            className="text-[22px] text-text-primary"
          />
        ) : (
          <RiHeartLine
            onClick={() => manageWishLists(product)}
            className="text-[22px] text-text-primary"
          />
        )}
      </div>
      <div className="relative">
        <Link to={`/product_details/${product._id}`}>
          <img
            src={image ? product.imageUrls[1] : product.imageUrls[0]}
            alt="Product"
            className="w-full h-auto"
          />
        </Link>
      </div>
      <div className="p-4 text-center">
        <h3 className="text-md xl:text-lg font-semibold text-gray-800 bricolage-grotesque">
          {product.name}
        </h3>
        <div className="flex gap-2 items-center justify-center">
          {product.previousPrice && (
            <s className="text-gray-500">
              {formatAmountDefault(currency, product.previousPrice)}
            </s>
          )}
          <p className="text-gray-500">
            {formatAmountDefault(currency, product.price)}
          </p>
        </div>
        <div className="mt-2">
          <div className="flex flex-wrap gap-1 items-center justify-center">
            {["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"].map(
              (size) => (
                <button
                  key={size}
                  className={`flex items-center justify-center border border-gray-300 rounded-sm text-gray-600 text-[10px] px-1 py-1 h-6 w-8 hover:bg-gray-100 transition poppins ${
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
    </div>
  );
};

export default ActiveWear;
