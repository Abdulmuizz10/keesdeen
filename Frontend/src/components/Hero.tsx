import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface HeroImage {
  url: string;
  tagline: string;
}

const Hero: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // State array for hero images - will be fetched from backend later
  // const [heroImages] = useState<HeroImage[]>([
  //   {
  //     url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&h=900&fit=crop",
  //     tagline: "Limitless",
  //   },
  //   {
  //     url: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&h=900&fit=crop",
  //     tagline: "Fearless",
  //   },
  //   {
  //     url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1600&h=900&fit=crop",
  //     tagline: "Boundless",
  //   },
  // ]);

  const [heroImages] = useState<HeroImage[]>([
    {
      url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&h=900&fit=crop",
      tagline: "Limitless",
    },
    {
      url: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&h=900&fit=crop",
      tagline: "Fearless",
    },
    {
      url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1600&h=900&fit=crop",
      tagline: "Boundless",
    },
    {
      url: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=1600&h=900&fit=crop",
      tagline: "Bold",
    },
    {
      url: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1600&h=900&fit=crop",
      tagline: "Dynamic",
    },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);

      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % heroImages.length);
        setIsTransitioning(false);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <div className="relative w-full h-screen overflow-hidden py-20 sm:py-0">
      {/* Image Slider */}
      {heroImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={image.url}
            alt={`Hero ${index + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/90" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-start justify-center h-full max-w-7xl mx-auto px-6 sm:px-12">
        <div className="space-y-6">
          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight">
            <span className="block">Be</span>
            <span
              className={`block transition-all duration-500 ${
                isTransitioning
                  ? "opacity-0 translate-y-4"
                  : "opacity-100 translate-y-0"
              }`}
            >
              {heroImages[currentIndex].tagline}
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-2xl font-light tracking-wide">
            Discover the perfect blend of style and comfort.
            <span className="hidden sm:flex">
              <br />
              Elevate your wardrobe with our latest collection.
            </span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col w-full sm:w-fit sm:flex-row gap-4 pt-8">
            <Link to={"/collections/shop_all"}>
              <button className="group relative px-8 py-4 bg-white text-black font-semibold text-base sm:text-lg overflow-hidden transition-all duration-300 w-full">
                <span className="relative z-10">Shop Now</span>
                {/* <div className="absolute inset-0 bg-black transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Shop Now
              </span> */}
              </button>
            </Link>

            <Link to={"/collections/new_arrivals"}>
              <button className="px-8 py-4 border border-white text-white font-semibold text-base sm:text-lg hover:bg-white hover:text-black transition-all duration-300 w-full">
                New Arrivals
              </button>
            </Link>
          </div>
        </div>

        {/* Slider Indicators */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 hidden sm:flex gap-3">
          {heroImages.map((_, index) => (
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
      </div>
    </div>
  );
};

export default Hero;
