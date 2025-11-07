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
import Axios from "axios";
import { URL } from "../../lib/constants";
import ProductCard from "../../components/ProductCard";

const ActiveWears: React.FC = () => {
  const { isActive } = useShop();
  const [showFilter, setShowFilter] = useState(false);

  // Filter + sort states
  const [subCategory, setSubCategory] = useState<string[]>([]);
  const [sizeCategory, setSizeCategory] = useState<string[]>([]);
  const [colorCategory, setColorCategory] = useState<string[]>([]);
  const [sortType, setSortType] = useState<string>("relevant");

  // Data & pagination
  const [products, setProducts] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pages, setPages] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const checkboxesRef = useRef<HTMLInputElement[]>([]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await Axios.get(
        `${URL}/products/collections/active-wears`,
        {
          params: {
            page,
            limit: 12,
            subcategory: subCategory.join(","),
            size: sizeCategory.join(","),
            color: colorCategory.join(","),
            sort:
              sortType === "Low - High"
                ? "low-high"
                : sortType === "High - Low"
                ? "high-low"
                : "relevant",
          },
        }
      );

      if (response.status === 200) {
        setProducts(response.data.products);
        setPages(response.data.pages);
      }
    } catch (error) {
      setError("Network error, unable to get products!");
    } finally {
      setLoading(false);
    }
  };

  // Fetch whenever filters, sort, or page changes
  useEffect(() => {
    fetchProducts();
  }, [subCategory, sizeCategory, colorCategory, sortType, page]);

  const toggleSubCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSubCategory((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const toggleSizeCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSizeCategory((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const toggleColorCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setColorCategory((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const clearFilters = () => {
    setSubCategory([]);
    setSizeCategory([]);
    setColorCategory([]);
    checkboxesRef.current.forEach((checkbox) => (checkbox.checked = false));
    setPage(1);
  };

  return (
    <section className="placing">
      <div className="flex-1">
        <div className="mb-2 md:mb-5">
          <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
            <span>Active Wears</span>
          </h2>
        </div>

        <div
          className={`flex flex-col xl:flex-row gap-5 sm:gap-10 pt-5 border-t border-border-secondary ${
            isActive && "opacity-0 transition-opacity"
          }`}
        >
          {/* Left side filters */}
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
              className={`border border-border-secondary pl-5 py-3 mt-5 ${
                showFilter ? "" : "hidden"
              } xl:block shadow-medium rounded`}
            >
              <p className="text-base md:text-md pb-3">Type</p>
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
                      onChange={toggleSubCategory}
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
              <p className="text-base md:text-md pb-3">Color</p>
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

          {/* Right side products */}
          <div className="w-full">
            <div className="flex justify-between text-base items-center">
              <p className="text-base md:text-md">Collections</p>

              <p className="info-text hidden xl:flex">
                Showing page {page} of {pages}
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
              <div className="max-w-[200px] w-full flex justify-end lg:hidden">
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

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xxl:grid-cols-4 gap-4 gap-y-6 w-full my-5">
              {loading ? (
                Array(12)
                  .fill(null)
                  .map((_, index) => (
                    <ProductCard key={index} product={null} loading={true} />
                  ))
              ) : products.length > 0 ? (
                products.map((product: any) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    loading={loading}
                  />
                ))
              ) : error ? (
                <p className="col-span-4 text-center text-lg mt-10">{error}</p>
              ) : (
                <p className="col-span-4 text-center text-lg mt-10">
                  No products found.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pagination fixed to bottom */}
      <div className="flex justify-center gap-4 mt-auto py-10 border-t border-border-secondary bg-white">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-3 py-2">
          Page {page} of {pages}
        </span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, pages))}
          disabled={page === pages}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </section>
  );
};

export default ActiveWears;
