import { useShop } from "@/context/ShopContext";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Hero: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { heroSettings, loadedImages, setLoadedImages, isFetched } = useShop();

  useEffect(() => {
    if (!heroSettings.images.length) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);

      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % heroSettings.images.length);
        setIsTransitioning(false);
      }, heroSettings.transitionDuration / 2);
    }, heroSettings.autoPlayInterval);

    return () => clearInterval(interval);
  }, [heroSettings]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black py-20 sm:py-0">
      {isFetched &&
        heroSettings.images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity ease-in-out ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
            style={{
              transitionDuration: `${heroSettings.transitionDuration}ms`,
            }}
          >
            <img
              src={image.url}
              alt={`Hero ${index + 1}`}
              decoding="async"
              fetchPriority={index === 0 ? "high" : "auto"}
              loading="eager"
              onLoad={() =>
                setLoadedImages((prev: any) => ({ ...prev, [index]: true }))
              }
              className={`w-full h-full object-cover transition-opacity duration-700 ${
                loadedImages[index] ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>
        ))}

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/100" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-start justify-center h-full max-w-7xl mx-auto px-6 sm:px-12">
        <div className="space-y-2 sm:space-y-1">
          {isFetched && heroSettings.images.length ? (
            <>
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight">
                <span className="block">Be</span>
                <span
                  className={`block transition-all duration-500 ${
                    isTransitioning
                      ? "opacity-0 translate-y-4"
                      : "opacity-100 translate-y-0"
                  }`}
                  style={{ fontSize: "clamp(3rem, 10vw, 12rem)" }}
                >
                  {heroSettings.images[currentIndex].tagline}
                </span>
              </h1>

              <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-2xl font-light tracking-wide">
                Discover the perfect blend of style and comfort
                <br />
                <span className="hidden sm:flex">
                  Elevate yourself with our latest collection.
                </span>
              </p>
            </>
          ) : (
            <>
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight">
                <span className="block">Be</span>
                <span
                  className={`block transition-all duration-500 ${
                    isTransitioning
                      ? "opacity-0 translate-y-4"
                      : "opacity-100 translate-y-0"
                  }`}
                  style={{ fontSize: "clamp(3rem, 10vw, 12rem)" }}
                >
                  Boundless
                </span>
              </h1>

              <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-2xl font-light tracking-wide">
                Discover the perfect blend of style and comfort
                <br />
                <span className="hidden sm:flex">
                  Elevate yourself with our latest collection.
                </span>
              </p>
            </>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col w-full sm:w-fit sm:flex-row gap-4 pt-8">
            <Link to={"/collections/shop_all"}>
              <button className="group relative px-8 py-4 bg-white text-black hover:text-white font-semibold text-base sm:text-lg overflow-hidden transition-all duration-300 w-full">
                <span className="relative z-10">Shop Now</span>
                <div className="absolute inset-0 bg-black transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Shop Now
                </span>
              </button>
            </Link>

            <Link to={"/collections/new_arrivals"}>
              <button className="px-8 py-4 border border-white text-white font-semibold text-base sm:text-lg hover:bg-white hover:text-black transition-all duration-300 w-full">
                New Arrivals
              </button>
            </Link>
          </div>
        </div>

        {/* Dots */}
        {heroSettings.images.length > 1 && (
          <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 hidden sm:flex gap-3">
            {heroSettings.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`transition-all duration-300 ${
                  index === currentIndex
                    ? "w-12 h-1 bg-white"
                    : "w-8 h-1 bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Hero;
