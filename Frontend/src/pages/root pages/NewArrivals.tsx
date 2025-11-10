import React, { useEffect, useState } from "react";
import { useShop } from "../../context/ShopContext";
import { X, SlidersHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@relume_io/relume-ui";
import Axios from "axios";
import { URL } from "../../lib/constants";
import ProductCard from "../../components/ProductCard";

const NewArrivals: React.FC = () => {
  const { isActive } = useShop();
  const [showFilter, setShowFilter] = useState(false);

  // Filter + sort states
  const [category, setCategory] = useState<string[]>([]);
  const [sizeCategory, setSizeCategory] = useState<string[]>([]);
  const [colorCategory, setColorCategory] = useState<string[]>([]);
  const [sortType, setSortType] = useState<string>("relevant");

  // Data & pagination
  const [products, setProducts] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pages, setPages] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await Axios.get(
        `${URL}/products/collections/new-arrivals`,
        {
          params: {
            page,
            limit: 12,
            category: category.join(","),
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

  useEffect(() => {
    fetchProducts();
  }, [category, sizeCategory, colorCategory, sortType, page]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (showFilter && window.innerWidth < 1280) {
        const sidebar = document.getElementById("filter-sidebar");
        if (sidebar && !sidebar.contains(e.target as Node)) {
          setShowFilter(false);
        }
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [showFilter]);

  const toggleCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCategory((prev) =>
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
    setCategory([]);
    setSizeCategory([]);
    setColorCategory([]);
    setPage(1);
  };

  const FilterContent = () => (
    <div className="space-y-8">
      {/* Category Filter */}
      <div className="border-b border-gray-200 pb-6">
        <h3 className="mb-4 text-xs uppercase tracking-widest text-gray-500">
          Type
        </h3>
        <div className="space-y-3 text-sm">
          {["Active Wear", "Fitness Accessories"].map((wear, index) => (
            <label
              key={index}
              className="flex cursor-pointer items-center gap-3 text-gray-600 transition-colors hover:text-gray-900"
            >
              <input
                type="checkbox"
                className="h-4 w-4 cursor-pointer border-gray-300"
                value={wear}
                checked={category.includes(wear)}
                onChange={toggleCategory}
              />
              {wear}
            </label>
          ))}
        </div>
      </div>

      {/* Size Filter */}
      <div className="border-b border-gray-200 pb-6">
        <h3 className="mb-4 text-xs uppercase tracking-widest text-gray-500">
          Size
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"].map(
            (size, index) => (
              <label
                key={index}
                className="flex cursor-pointer items-center gap-2 text-sm text-gray-600 transition-colors hover:text-gray-900"
              >
                <input
                  type="checkbox"
                  className="h-4 w-4 cursor-pointer border-gray-300"
                  value={size}
                  checked={sizeCategory.includes(size)}
                  onChange={toggleSizeCategory}
                />
                {size}
              </label>
            )
          )}
        </div>
      </div>

      {/* Color Filter */}
      <div className="border-b border-gray-200 pb-6">
        <h3 className="mb-4 text-xs uppercase tracking-widest text-gray-500">
          Color
        </h3>
        <div className="space-y-3 text-sm">
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
            <label
              key={index}
              className="flex cursor-pointer items-center gap-3 text-gray-600 transition-colors hover:text-gray-900"
            >
              <input
                type="checkbox"
                className="h-4 w-4 cursor-pointer border-gray-300"
                value={color.name}
                checked={colorCategory.includes(color.name)}
                onChange={toggleColorCategory}
              />
              <span
                style={{ backgroundColor: color.code }}
                className={`h-4 w-4 border ${
                  color.name === "White"
                    ? "border-gray-300"
                    : "border-transparent"
                }`}
              />
              {color.name}
            </label>
          ))}
        </div>
      </div>

      {/* Clear Button */}
      <button
        onClick={clearFilters}
        className="w-full border border-gray-900 bg-gray-900 py-3 text-sm uppercase tracking-widest text-white transition-colors hover:bg-gray-800"
      >
        Clear All
      </button>
    </div>
  );

  return (
    <section className="placing">
      {/* Header */}
      <div className="mb-5 lg:mb-10 border-b border-gray-200 pb-8">
        <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
          <span>New Arrivals</span>
        </h2>
        <p className="text-sm text-text-secondary">
          {products.length} {products.length > 1 ? "products" : "product"}
        </p>
      </div>

      {/* Overlay for mobile */}
      {showFilter && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 xl:hidden" />
      )}

      {/* Main Content */}
      <div
        className={`flex gap-12 ${isActive && "opacity-0 transition-opacity"}`}
      >
        {/* Sidebar - Desktop: static, Mobile: slide-in */}
        <aside
          id="filter-sidebar"
          className={`fixed left-0 top-0 z-50 lg:z-30 h-full w-80 overflow-y-auto bg-white p-6 transition-transform duration-300 xl:sticky xl:top-8 xl:block xl:h-fit xl:w-64 xl:translate-x-0 xl:p-0 ${
            showFilter ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Mobile Header */}
          <div className="mb-8 flex items-center justify-between border-b border-gray-200 pb-6 xl:hidden">
            <h2 className="text-lg font-light tracking-tight">Filters</h2>
            <button
              onClick={() => setShowFilter(false)}
              className="text-gray-400 transition-colors hover:text-gray-900"
            >
              <X size={24} strokeWidth={1.5} />
            </button>
          </div>

          <FilterContent />
        </aside>

        {/* Products Section */}
        <div className="flex-1">
          {/* Top Bar */}
          <div className="mb-8 flex items-center justify-between">
            {/* Filter Button - Mobile Only */}
            <button
              onClick={() => setShowFilter(true)}
              className="flex items-center gap-2 border border-gray-300 px-4 py-2 text-sm uppercase tracking-widest text-gray-600 transition-colors hover:border-gray-900 hover:text-gray-900 xl:hidden"
            >
              <SlidersHorizontal size={16} strokeWidth={1.5} />
              Filters
            </button>

            {/* Page Info - Desktop Only */}
            <p className="hidden text-sm text-gray-500 xl:block">
              Page {page} of {pages}
            </p>

            {/* Sort Dropdown */}
            <div className="w-48">
              <Select onValueChange={setSortType} defaultValue="relevant">
                <SelectTrigger className="border-gray-300 text-sm">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="border border-gray-300 bg-white">
                  <SelectItem
                    value="relevant"
                    className="cursor-pointer text-sm hover:bg-gray-50"
                  >
                    Relevance
                  </SelectItem>
                  <SelectItem
                    value="Low - High"
                    className="cursor-pointer text-sm hover:bg-gray-50"
                  >
                    Price: Low to High
                  </SelectItem>
                  <SelectItem
                    value="High - Low"
                    className="cursor-pointer text-sm hover:bg-gray-50"
                  >
                    Price: High to Low
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xxl:grid-cols-4">
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
              <p className="col-span-full py-20 text-center text-sm uppercase tracking-widest text-gray-400">
                {error}
              </p>
            ) : (
              <p className="col-span-full py-20 text-center text-sm uppercase tracking-widest text-gray-400">
                No products found
              </p>
            )}
          </div>
        </div>
      </div>
      {/* Pagination */}
      <div className="mt-16 flex items-center justify-between border-t border-gray-200 pt-8">
        <button
          className={`text-sm uppercase tracking-widest transition-colors ${
            page === 1
              ? "cursor-not-allowed text-gray-300"
              : "text-gray-900 hover:text-gray-400"
          }`}
          disabled={page === 1}
          onClick={() => {
            setPage((prev) => Math.max(prev - 1, 1));
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          Previous
        </button>
        <span className="text-sm text-gray-500">
          Page {page} of {pages}
        </span>
        <button
          className={`text-sm uppercase tracking-widest transition-colors ${
            page === pages
              ? "cursor-not-allowed text-gray-300"
              : "text-gray-900 hover:text-gray-400"
          }`}
          disabled={page === pages}
          onClick={() => {
            setPage((prev) => Math.min(prev + 1, pages));
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          Next
        </button>
      </div>
    </section>
  );
};

export default NewArrivals;
