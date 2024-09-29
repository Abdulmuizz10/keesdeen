import React, { useEffect, useState } from "react";
import { LuHeart } from "react-icons/lu";
import { useShop } from "../../context/ShopContext";
import { Link } from "react-router-dom";
import { formatAmount } from "../../lib/utils";

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

const WishLists: React.FC = () => {
  const { wishLists, manageWishLists, products } = useShop();
  const [lists, setLists] = useState<ClothingProduct[]>();
  const [image, setImage] = useState<boolean>(false);

  useEffect(() => {
    const filteredProducts = products.filter((product) =>
      wishLists.includes(product.id)
    );
    setLists(filteredProducts);
  }, [wishLists]);

  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-10">
      <div className="container">
        <div className="rb-12 mb-12 md:mb-5">
          <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl bricolage-grotesque">
            Wishlists
          </h2>
        </div>

        <div className="mt-4 border-t border-border-secondary ">
          {lists && lists.length === 0 ? (
            <p className="mt-4 text-3xl text-text-secondary">
              Your wishlists is empty.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-5">
              {lists &&
                lists.map((product) => (
                  <div
                    className="max-w-xs mx-auto bg-white rounded-b-lg shadow-large overflow-hidden relative"
                    onMouseOver={() => setImage(true)}
                    onMouseLeave={() => setImage(false)}
                  >
                    <div className="absolute top-3 right-3 z-50 cursor-pointer">
                      <LuHeart onClick={() => manageWishLists(product.id)} />
                    </div>
                    <div className="relative">
                      <Link to={`/product_details/${product.id}`}>
                        <img
                          src={
                            image ? product.imageUrl[1] : product.imageUrl[0]
                          }
                          alt="Product"
                          className="w-full h-auto"
                        />
                      </Link>
                    </div>
                    <div className="p-4 text-center">
                      <h3 className="text-lg font-semibold text-gray-800 bricolage-grotesque">
                        {product.name}
                      </h3>
                      <p className="text-gray-500">
                        {formatAmount(product.price)}
                      </p>

                      <div className="mt-2">
                        <div className="flex flex-wrap gap-2 items-center justify-center">
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
                              className="border border-gray-300 rounded-lg text-gray-600 text-xs px-2 py-1 h-8 w-10 hover:bg-gray-100 transition poppins"
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default WishLists;
