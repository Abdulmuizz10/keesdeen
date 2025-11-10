import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { lenis } from "../lib/useLenisScroll";

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [location.pathname]);

  return null;
};

export default ScrollToTop;
