import { useEffect, useState } from "react";
import { useShop } from "../context/ShopContext";
import ProductItem from "./ProductItem";

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

const RelatedProducts = ({ category }: any) => {
  const { products } = useShop();
  const [related, setRelated] = useState<Product[]>();

  useEffect(() => {
    if (products.length > 0) {
      let productsCopy = products.slice();
      productsCopy = productsCopy.filter((item) => category === item.category);
      setRelated(productsCopy.slice(1, 5));
    }
  }, [products]);

  return (
    <div className="my-10">
      <div className="rb-12 mb-12 md:mb-5">
        <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl bricolage-grotesque">
          Related Products
        </h2>
        <p className="md:text-md">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
      </div>
      <div className="grid gird-cols md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4 gap-y-6">
        {related &&
          related.map((product, index) => (
            <ProductItem product={product} key={index} />
          ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
