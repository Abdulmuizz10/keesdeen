import { Link } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import { useEffect, useRef } from "react";
// import { useInView } from "framer-motion";
// import gsap from "gsap";
import { useInView } from "../lib/utils";
import { motion } from "framer-motion";

type Props = {
  heading: string;
  description: string;
};

export type Gallery4Props = React.ComponentPropsWithoutRef<"section"> &
  Partial<Props>;

export const Gallery4 = (props: Gallery4Props) => {
  const { heading, description } = {
    ...Gallery4Defaults,
    ...props,
  } as Props;

  const { products } = useShop();
  const bestSellers = products.slice(0, 4);

  // const Container = useRef(null);
  // const inView = useInView(Container, { once: true });

  // useEffect(() => {
  //   gsap.fromTo(
  //     ".block-container",
  //     {
  //       opacity: 0,
  //       y: 100,
  //       scale: 0.5,
  //     },
  //     {
  //       opacity: 1,
  //       y: 0,
  //       scale: 1,
  //       ease: "power3.in",
  //       stagger: 0.4,
  //       delay: 0.2,
  //     }
  //   );
  // }, [inView]);

  const ref = useRef(null);
  const isInView = useInView(ref);
  return (
    <section
      id="relume"
      className="px-[5%] py-16 md:py-24 lg:py-28"
      // ref={Container}
      ref={ref}
    >
      <div className="container">
        <div className="rb-12 mb-12 text-center md:mb-18 lg:mb-20">
          <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl text-text-primary">
            {heading}
          </h2>
          <p className="md:text-md">{description}</p>
        </div>
        <div className="grid grid-cols-2 items-start justify-center gap-6 md:gap-8 lg:grid-cols-4">
          {bestSellers &&
            bestSellers.map((product, index) => (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }}
                transition={{
                  duration: 0.5,
                  ease: "easeOut",
                  delay: index * 0.4,
                }}
              >
                <Link
                  key={index}
                  to={`/best_sellers/${product.name}`}
                  className="block-container"
                >
                  <img
                    src={product.imageUrl[0]}
                    alt="best seller image"
                    className="size-full object-cover"
                  />
                </Link>
              </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
};

export const Gallery4Defaults: Gallery4Props = {
  heading: "Our Best Sellers",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  // images: [
  //   {
  //     url: "#",
  //     src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
  //     alt: "Relume placeholder image 1",
  //   },
  //   {
  //     url: "#",
  //     src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
  //     alt: "Relume placeholder image 2",
  //   },
  //   {
  //     url: "#",
  //     src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
  //     alt: "Relume placeholder image 3",
  //   },
  //   {
  //     url: "#",
  //     src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
  //     alt: "Relume placeholder image 4",
  //   },
  // ],
};
