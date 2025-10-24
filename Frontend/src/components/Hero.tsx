import { Button } from "@relume_io/relume-ui";
import { Images } from "../assets";
import { Link } from "react-router-dom";

type ImageProps = {
  src: string;
  alt?: string;
};

type Props = {
  heading: string;
  description: string;
  images: ImageProps[];
  images1: ImageProps[];
};

export type Header76Props = React.ComponentPropsWithoutRef<"section"> &
  Partial<Props>;

export const Header76 = (props: Header76Props) => {
  const { heading, description, images, images1 } = {
    ...Header76Defaults,
    ...props,
  } as Props;

  return (
    <section className="grid grid-cols-1 gap-y-16 pt-24 md:grid-flow-row md:pt-30 lg:grid-flow-col lg:grid-cols-2 lg:items-center lg:pt-0 bg-background-light">
      <div className="mx-[5%] max-w-[40rem] justify-self-start lg:ml-[5vw] lg:mr-20 lg:justify-self-end">
        {/* <h1 className="mb-5 text-6xl font-bold md:mb-6 md:text-9xl lg:text-10xl bricolage-grotesque text-brand-neutral">
          {heading}
        </h1> */}
        <h1 className="mb-5 text-6xl font-bold md:mb-6 md:text-7xl lg:text-8xl xl:text-9xl bricolage-grotesque text-gradient">
          {heading}
        </h1>
        {/* <p className="md:text-md text-text-primary">{description}</p> */}
        <p className="text-base sm:text-md text-text-primary">{description}</p>
        <div className="mt-6 flex gap-x-4 md:mt-8">
          {[
            { route: "/collections/new_in", text: "New arrivals" },
            { route: "/collections/shop_all", text: "Shop now" },
          ].map((link, index) => (
            <Link to={link.route} key={index}>
              <Button
                className={`${
                  index === 0
                    ? "!text-text-primary !border-border-primary"
                    : "bg-brand-primary border-none"
                } text-text-light poppins rounded-md`}
              >
                {link.text}
              </Button>
            </Link>
          ))}
        </div>
      </div>
      <div
        className={`h-[30rem] overflow-hidden pl-[5vw] pr-[5vw] md:h-[40rem] lg:h-screen lg:pl-0  transition-all`}
      >
        <div className="grid w-full grid-cols-2 gap-x-4">
          <div className="-mt-[120%] grid size-full animate-loop-vertically columns-2 grid-cols-1 gap-4 self-center">
            {images.map((image, index) => (
              <div key={index} className="grid size-full grid-cols-1 gap-4">
                <div className="relative w-full pt-[120%] z-10">
                  <img
                    className="absolute inset-0 size-full object-cover"
                    src={image.src}
                    alt={image.alt}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="grid size-full animate-loop-vertically grid-cols-1 gap-4">
            {images1.map((image, index) => (
              <div key={index} className="grid size-full grid-cols-1 gap-4">
                <div className="relative w-full pt-[120%] z-10">
                  <img
                    className="absolute inset-0 size-full object-cover"
                    src={image.src}
                    alt={image.alt}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export const Header76Defaults: Header76Props = {
  // heading: "Medium length hero heading goes here",
  heading: "...be boundless",
  description:
    // "Discover our thoughtfully curated collection of modest activewear and fitness accessories, designed to empower your every move without compromising comfort or elegance.",
    "Discover our thoughtfully curated collection of modest activewear and fitness accessories, designed to empower your every move.",
  images: [
    {
      src: Images.img_1,
      alt: "Placeholder image",
    },
    {
      src: Images.img_2_1,
      alt: "Placeholder image",
    },
    {
      src: Images.img_26,
      alt: "Placeholder image",
    },
    {
      src: Images.img_35,
      alt: "Placeholder image",
    },
    {
      src: Images.img_17,
      alt: "Placeholder image",
    },
    {
      src: Images.img_20,
      alt: "Placeholder image",
    },
  ],
  images1: [
    {
      src: Images.img_31,
      alt: "Placeholder image",
    },
    {
      src: Images.img_38,
      alt: "Placeholder image",
    },
    {
      src: Images.img_36,
      alt: "Placeholder image",
    },
    {
      src: Images.img_44,
      alt: "Placeholder image",
    },
    {
      src: Images.img_42,
      alt: "Placeholder image",
    },
    {
      src: Images.img_34,
      alt: "Placeholder image",
    },
  ],
};
