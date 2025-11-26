import React, { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@relume_io/relume-ui";
import type { CarouselApi } from "@relume_io/relume-ui";
import Axios from "axios";
import { URL } from "../lib/constants";
import ProductCard from "./ProductCard";

const BestSellersSection: React.FC = () => {
  const [api, setApi] = useState<CarouselApi | undefined>(undefined);
  const [_, setCurrent] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await Axios.get(`${URL}/products/home/best-sellers`, {
          validateStatus: (status) => status < 600,
        });
        if (res.status === 200) {
          setProducts(res.data);
          setLoading(false);
        } else {
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (api) {
      setCurrent(api.selectedScrollSnap() + 1);
      api.on("select", () => setCurrent(api.selectedScrollSnap() + 1));

      // Automatically scroll to next item every 6 seconds
      const autoScroll = setInterval(() => api.scrollNext(), 6000);
      return () => clearInterval(autoScroll);
    }
  }, [api]); // Add products to the dependency array

  return (
    <section>
      <div className="placing">
        <div className="container">
          <div className="mb-12 text-center md:mb-18 lg:mb-10">
            <h2 className="mb-5 text-5xl font-semibold md:mb-6 md:text-7xl lg:text-8xl">
              <span>Best Sellers</span>
            </h2>
            <p className="md:text-md text-text-primary">
              Our Best Sellers: Where Modesty Meets Unmatched Style.
            </p>
          </div>

          <Carousel
            setApi={setApi}
            opts={{
              loop: true,
              align: "start",
            }}
          >
            <div className="relative">
              <CarouselContent className="ml-0">
                {loading
                  ? Array(10)
                      .fill(null)
                      .map((_, index) => (
                        <CarouselItem
                          key={index}
                          className="basis-full md:basis-2/4 lg:basis-1/4"
                        >
                          <ProductCard
                            product={""}
                            loading={loading}
                            key={index}
                          />
                        </CarouselItem>
                      ))
                  : products?.map((product: any, index: number) => (
                      <CarouselItem
                        key={index}
                        className="basis-full md:basis-2/4 lg:basis-1/4"
                      >
                        <ProductCard
                          product={product}
                          loading={loading}
                          key={index}
                        />
                      </CarouselItem>
                    ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex md:size-12 lg:size-14 bg-gray-200 border border-gray-600" />
              <CarouselNext className="hidden md:flex md:size-12 lg:size-14 bg-gray-200 border border-gray-600" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default BestSellersSection;
