import React from "react";
import { CarouselItem } from "@relume_io/relume-ui";
import { RiHeartLine } from "react-icons/ri";
import { RiHeartFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import { formatAmountDefault } from "../lib/utils";
import { currency } from "../lib/constants";

interface ProductProps {
  product: any;
  loading: Boolean;
}

const LargeProductCard: React.FC<ProductProps> = ({ product, loading }) => {
  const { wishLists, manageWishLists } = useShop();

  if (loading) {
    return (
      <CarouselItem className="basis-full pl-0 sm:basis-2/5 md:basis-1/2 relative">
        <div className="aspect-square h-[600px] w-full bg-gray-200 object-cover animate-pulse" />
      </CarouselItem>
    );
  }
  return (
    <CarouselItem className="basis-full pl-0 sm:basis-2/5 md:basis-1/2 relative">
      <div className="absolute top-3 right-3 z-50 cursor-pointer">
        {wishLists.find((wish: any) => wish._id === product._id) ? (
          <RiHeartFill
            onClick={() => manageWishLists(product)}
            className="text-2xl text-text-primary"
          />
        ) : (
          <RiHeartLine
            onClick={() => manageWishLists(product)}
            className="text-2xl text-text-primary"
          />
        )}
      </div>
      <Link to={`/product_details/${product._id}`}>
        <img
          src={product?.imageUrls[0]}
          alt={`${product.name} - New Arrival`}
          className="aspect-square size-full object-cover"
        />
        <div className="mt-2">
          <h3 className="text-md xl:text-lg font-semibold text-gray-800 bricolage-grotesque">
            {product.name}
          </h3>

          <div className="flex gap-2 items-center justify-start">
            {product.previousPrice && (
              <s className="text-gray-500">
                {formatAmountDefault(currency, product.previousPrice)}
              </s>
            )}
            <p className="text-gray-500">
              {formatAmountDefault(currency, product.price)}
            </p>
          </div>
        </div>
      </Link>
    </CarouselItem>
  );
};

export default LargeProductCard;
