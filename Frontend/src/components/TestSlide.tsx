"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import clsx from "clsx";

type Props = {
  headings: string[];
};

export type TextSlideProps = React.ComponentPropsWithoutRef<"section"> &
  Partial<Props>;

const TextSlide = (props: TextSlideProps) => {
  const { headings } = {
    ...Banner13Defaults,
    ...props,
  } as Props;

  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const xPartOne = useTransform(scrollYProgress, [0, 1], ["-10%", "0%"]);
  const xPartTwo = useTransform(scrollYProgress, [0, 1], ["10%", "0%"]);

  return (
    <section
      id="relume"
      ref={sectionRef}
      className="overflow-hidden px-[5%] py-16 md:py-24 lg:py-28"
    >
      <div className="flex flex-col whitespace-nowrap">
        {headings.map((heading, index) => (
          <motion.h1
            key={index}
            style={index % 2 === 0 ? { x: xPartOne } : { x: xPartTwo }}
            className={clsx(
              "text-[6rem] font-bold leading-[1.2] bricolage-grotesque text-brand-primary",
              {
                "self-end": index % 2 !== 0,
              }
            )}
          >
            <span>{heading}</span>
          </motion.h1>
        ))}
      </div>
    </section>
  );
};

export default TextSlide;

export const Banner13Defaults: TextSlideProps = {
  headings: [
    "Keesdeen Keesdeen Keesdeen Keesdeen Keesdeen",
    "Keesdeen Keesdeen Keesdeen Keesdeen Keesdeen",
  ],
};
