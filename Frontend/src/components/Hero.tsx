import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Axios from "axios";
import { URL } from "@/lib/constants";

interface HeroImage {
  url: string;
  tagline: string;
}

interface HeroSettings {
  images: HeroImage[];
  transitionDuration: number;
  autoPlayInterval: number;
}

// Default fallback images - shown immediately while API loads
const DEFAULT_HERO_SETTINGS: HeroSettings = {
  images: [],
  transitionDuration: 1000,
  autoPlayInterval: 5000,
};

const Hero: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [heroSettings, setHeroSettings] = useState<HeroSettings>(
    DEFAULT_HERO_SETTINGS
  );
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>([]);
  const hasInitialized = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Preload images for instant display
  const preloadImages = (images: HeroImage[]) => {
    const loadPromises = images.map((image, index) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          setImagesLoaded((prev) => {
            const newState = [...prev];
            newState[index] = true;
            return newState;
          });
          resolve();
        };
        img.onerror = () => resolve(); // Continue even if image fails
        img.src = image.url;
      });
    });
    return Promise.all(loadPromises);
  };

  // Fetch hero settings from API in background (non-blocking)
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    // Preload default images immediately
    preloadImages(DEFAULT_HERO_SETTINGS.images);

    // Fetch API data in background without blocking UI
    const fetchHeroSettings = async () => {
      try {
        const res = await Axios.get(`${URL}/settings/get-hero`, {
          timeout: 3000, // 3 second timeout
        });

        if (res.data.success && res.data.data.images.length > 0) {
          const newSettings = res.data.data;
          // Preload new images before switching
          await preloadImages(newSettings.images);
          setHeroSettings(newSettings);
        }
      } catch (error) {
        // Silent fail - continue with defaults
        console.warn("Using default hero images");
      }
    };

    fetchHeroSettings();
  }, []);

  // Auto-play carousel
  useEffect(() => {
    if (heroSettings.images.length === 0) return;

    // Clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setIsTransitioning(true);

      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % heroSettings.images.length);
        setIsTransitioning(false);
      }, heroSettings.transitionDuration / 2);
    }, heroSettings.autoPlayInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [heroSettings]);

  // Manual slide change
  const goToSlide = (index: number) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsTransitioning(false);
    }, heroSettings.transitionDuration / 2);

    // Restart auto-play
    intervalRef.current = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % heroSettings.images.length);
        setIsTransitioning(false);
      }, heroSettings.transitionDuration / 2);
    }, heroSettings.autoPlayInterval);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Image Slider with optimized rendering */}
      <div className="absolute inset-0">
        {heroSettings.images.map((image, index) => (
          <div
            key={`${image.url}-${index}`}
            className={`absolute inset-0 transition-opacity ease-in-out ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
            style={{
              transitionDuration: `${heroSettings.transitionDuration}ms`,
              willChange:
                index === currentIndex ||
                index === (currentIndex + 1) % heroSettings.images.length
                  ? "opacity"
                  : "auto",
            }}
          >
            <img
              src={image.url}
              alt={`${image.tagline} collection`}
              className="w-full h-full object-cover"
              loading={index === 0 ? "eager" : "lazy"}
              decoding={index === 0 ? "sync" : "async"}
              fetchPriority={index === 0 ? "high" : "low"}
              style={{
                opacity: imagesLoaded[index] ? 1 : 0,
                transition: "opacity 0.3s ease-in-out",
              }}
            />
            {/* Skeleton/Placeholder while image loads */}
            {!imagesLoaded[index] && (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black animate-pulse" />
            )}
          </div>
        ))}
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-start justify-center h-full max-w-7xl mx-auto px-6 sm:px-12">
        <div className="space-y-2 sm:space-y-1 animate-fade-in">
          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight">
            <span className="block">Be</span>
            <span
              className={`block transition-all duration-500 ${
                isTransitioning
                  ? "opacity-0 translate-y-4"
                  : "opacity-100 translate-y-0"
              }`}
              style={{
                fontSize: "clamp(3rem, 10vw, 12rem)",
                willChange: "opacity, transform",
              }}
            >
              {heroSettings.images[currentIndex]?.tagline || "Boundless"}
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-2xl font-light tracking-wide">
            Discover the perfect blend of style and comfort
            <br />
            <span className="hidden sm:inline">
              Elevate yourself with our latest collection.
            </span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col w-full sm:w-fit sm:flex-row gap-4 pt-8">
            <Link to="/collections/shop_all" className="w-full sm:w-auto">
              <button
                className="group relative px-8 py-4 bg-white text-black font-semibold text-base sm:text-lg overflow-hidden transition-all duration-300 w-full hover:shadow-2xl"
                aria-label="Shop all collections"
              >
                <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                  Shop Now
                </span>
                <div className="absolute inset-0 bg-black transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              </button>
            </Link>

            <Link to="/collections/new_arrivals" className="w-full sm:w-auto">
              <button
                className="px-8 py-4 border-2 border-white text-white font-semibold text-base sm:text-lg hover:bg-white hover:text-black transition-all duration-300 w-full hover:shadow-2xl"
                aria-label="View new arrivals"
              >
                New Arrivals
              </button>
            </Link>
          </div>
        </div>

        {/* Slider Indicators */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 hidden sm:flex gap-3">
          {heroSettings.images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 ${
                index === currentIndex
                  ? "w-12 h-1 bg-white"
                  : "w-8 h-1 bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === currentIndex ? "true" : "false"}
            />
          ))}
        </div>
      </div>

      {/* Add CSS animation for fade-in */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Hero;
