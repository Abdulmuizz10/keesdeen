import { Link } from "react-router-dom";
import { useShop } from "../context/ShopContext";

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
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="rb-12 mb-12 text-center md:mb-18 lg:mb-20">
          <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
            {heading}
          </h2>
          <p className="md:text-md">{description}</p>
        </div>
        <div className="grid grid-cols-2 items-start justify-center gap-6 md:gap-8 lg:grid-cols-4">
          {bestSellers.map((product, index) => (
            <Link key={index} to={`/collections/${product.name}`}>
              <img
                src={product.imageUrl[0]}
                alt="best seller image"
                className="size-full object-cover"
              />
            </Link>
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
