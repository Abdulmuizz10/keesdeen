import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "@relume_io/relume-ui";
import type { CarouselApi } from "@relume_io/relume-ui";
import clsx from "clsx";

import { URL } from "../lib/constants";
import Axios from "axios";
import LargeProductCard from "./LargeProductCard";

type NewArrivalsSectionProps = React.ComponentPropsWithoutRef<"section"> & {
  heading?: string;
  description?: string;
};

const NewArrivalsSection = ({
  heading = "New Arrivals",
  description = "Discover the latest additions to our Arrivals.",
}: NewArrivalsSectionProps) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);

  // Fetch products on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await Axios.get(`${URL}/products/home/new-arrivals`, {
          validateStatus: (status) => status < 600,
        });

        if (res.status === 200) {
          setProducts(res.data);
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

  // Set up carousel scroll state
  useEffect(() => {
    if (api) {
      const updateCurrentSlide = () => setCurrent(api.selectedScrollSnap() + 1);
      api.on("select", updateCurrentSlide);
      return () => {
        api.off("select", updateCurrentSlide); // Clean up listener on unmount
      };
    }
  }, [api]);

  // Filter products for new arrivals with valid images

  return (
    <section className="placing">
      <div className="container">
        <div className="rb-12 mb-12 text-center md:mb-18 lg:mb-20">
          <h2 className="rb-5 mb-5 text-5xl font-semibold md:mb-6 md:text-7xl lg:text-8xl text-gradient">
            <span>{heading}</span>
          </h2>
          <p className="md:text-md">{description}</p>
        </div>

        <Carousel
          setApi={setApi}
          opts={{
            loop: true,
            align: "start",
          }}
        >
          <CarouselContent className="ml-0 gap-4">
            {loading
              ? Array(10)
                  .fill(null)
                  .map((_, index) => (
                    <LargeProductCard
                      product={""}
                      loading={loading}
                      key={index}
                    />
                  ))
              : products?.map((product: any, index) => (
                  <LargeProductCard
                    product={product}
                    loading={loading}
                    key={index}
                  />
                ))}
          </CarouselContent>
          <div className="mt-20 flex items-center justify-between">
            {/* Dot indicators for carousel */}
            <div className="mt-5 flex w-full items-start justify-start">
              {loading
                ? Array(10)
                    .fill(null)
                    .map((_, index) => (
                      <button
                        key={`dot-${index}`}
                        onClick={() => api?.scrollTo(index)}
                        aria-label={`Slide ${index + 1}`}
                        className={clsx(
                          "mx-[3px] inline-block size-2 rounded-full",
                          {
                            "bg-black": current === index + 1,
                            "bg-neutral-400": current !== index + 1,
                          }
                        )}
                      />
                    ))
                : products?.map((_, index) => (
                    <button
                      key={`dot-${index}`}
                      onClick={() => api?.scrollTo(index)}
                      aria-label={`Slide ${index + 1}`}
                      className={clsx(
                        "mx-[3px] inline-block size-2 rounded-full",
                        {
                          "bg-black": current === index + 1,
                          "bg-neutral-400": current !== index + 1,
                        }
                      )}
                    />
                  ))}
            </div>
            {/* Carousel navigation buttons */}
            <div className="flex items-end justify-end gap-2 md:gap-4">
              <CarouselPrevious
                aria-label="Previous slide"
                className="static right-0 top-0 size-12 -translate-y-0"
              />
              <CarouselNext
                aria-label="Next slide"
                className="static right-0 top-0 size-12 -translate-y-0"
              />
            </div>
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default NewArrivalsSection;
