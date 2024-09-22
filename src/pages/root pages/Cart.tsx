import React, { useEffect, useState } from "react";
import { useShop } from "../../context/ShopContext";
import { formatAmount } from "../../lib/utils";
import { RiDeleteBin5Line } from "react-icons/ri";
import CartTotal from "../../components/CartTotal";
import { Button } from "@relume_io/relume-ui";
// import { useHistory } from "react-router-dom";

// interface productData {
//   id: number;
//   name: string;
//   brand: string;
//   category: string;
//   price: number;
//   size: string;
//   color: string;
//   rating: number;
//   reviews: number;
//   isAvailable: boolean;
//   material: string;
//   gender: string;
//   imageUrl: string[];
//   description: string;
// }

const Cart: React.FC = () => {
  const { products, cartItems, updateQuantity } = useShop();
  const [cartData, setCartData] = useState<any>();

  useEffect(() => {
    const tempData = [];
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          tempData.push({
            id: items,
            size: item,
            quantity: cartItems[items][item],
          });
        }
      }
    }
    setCartData(tempData);
  }, [cartItems]);

  console.log(cartData);

  // const history = useHistory();

  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-10">
      <div className="container">
        <div className="rb-12 mb-12 md:mb-5">
          <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl bricolage-grotesque">
            Cart
          </h2>
        </div>

        <div className="border-t ">
          {cartData &&
            cartData.map((item: any, index: number) => {
              const productData = products.find(
                (product) => product.id === Number(item.id)
              );

              return productData ? (
                <div
                  key={index}
                  className="py-4 border-b  text-text-secondary grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4 "
                >
                  <div className="flex items-start gap-6">
                    <img
                      className="w-16 sm:w-20 rounded-sm"
                      src={productData.imageUrl[0]}
                      alt="cart image"
                    />
                    <div className="flex flex-col gap-2">
                      <p className="text-xs sm:text-lg font-medium text-text-primary bricolage-grotesque">
                        {productData.name}
                      </p>
                      <div className="flex items-center gap-2 sm:gap-5 mt-1">
                        <p>{formatAmount(productData.price)}</p>
                        <p className="-2 h-[30px] w-[30px] md:h-[42px] md:w-[42px] bg-gray-300 flex items-center justify-center cursor-pointer text-text-primary rounded-sm">
                          {item.size}
                        </p>
                      </div>
                    </div>
                  </div>
                  <input
                    className="border border-border-primary max-w-[40px] sm:max-w-[80px] px-1 sm:px-2 sm:py-1 py-[2px] text-text-primary rounded-md"
                    type="number"
                    min={1}
                    defaultValue={item.quantity}
                    onChange={(e) =>
                      e.target.value === "" || e.target.value === "0"
                        ? null
                        : updateQuantity(
                            item.id,
                            item.size,
                            Number(e.target.value)
                          )
                    }
                  />
                  <RiDeleteBin5Line
                    className="text-text-primary h-[45px] w-[25px] cursor-pointer"
                    onClick={() => updateQuantity(item.id, item.size, 0)}
                  />
                </div>
              ) : null;
            })}
        </div>

        <div className="flex justify-end my-20">
          <div className="w-full sm:w-[450px] border border-border-primary p-5 rounded-md shadow-xlarge">
            <CartTotal />
            <div className="w-full text-end mt-5">
              <Button
                className="w-full rounded-md"
                // onClick={() => history.push("/place_order")}
              >
                PROCEED TO CHECKOUT
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cart;
