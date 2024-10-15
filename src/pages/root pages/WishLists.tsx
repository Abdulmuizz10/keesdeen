import React, { useEffect, useState } from "react";
import { useShop } from "../../context/ShopContext";
import ProductItem from "../../components/ProductItem";

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
  const { wishLists, products, isActive } = useShop();
  const [lists, setLists] = useState<ClothingProduct[]>();

  useEffect(() => {
    const filteredProducts = products.filter((product) =>
      wishLists.includes(product.id)
    );
    setLists(filteredProducts);
  }, [wishLists]);

  return (
    <section id="relume" className="px-[5%] py-24 md:py-30">
      <div className="container">
        <div className="rb-12 mb-12 md:mb-5">
          <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl bricolage-grotesque">
            Wishlists
          </h2>
        </div>

        <div
          className={`mt-4 border-t border-border-secondary ${
            isActive && "opacity-0 transition-opacity"
          } `}
        >
          {lists && lists.length === 0 ? (
            <p className="mt-4 text-3xl text-text-secondary">
              Your wishlists is empty.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-5">
              {lists &&
                lists.map((product, index) => (
                  <ProductItem product={product} key={index} />
                ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default WishLists;
