import { useEffect } from "react";
import Lenis from "lenis";

export let lenis: Lenis | null = null;

export function useLenisScroll() {
  useEffect(() => {
    lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis?.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis?.destroy();
      lenis = null;
    };
  }, []);
}
