import { Button } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";

type ImageProps = {
  src: string;
  alt?: string;
};

type Props = {
  heading: string;
  description: string;
  buttons: ButtonProps[];
  image: ImageProps;
};

export type Cta3Props = React.ComponentPropsWithoutRef<"section"> &
  Partial<Props>;

export const Cta3 = (props: Cta3Props) => {
  const { heading, description, buttons, image } = {
    ...Cta3Defaults,
    ...props,
  } as Props;
  return (
    <section className="relative px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container flex items-center justify-center">
        <div className="w-full max-w-lg text-center">
          <h2 className="mb-5 text-5xl font-bold text-text-alternative md:mb-6 md:text-7xl lg:text-8xl bricolage-grotesque">
            {heading}
          </h2>
          <p className="text-base text-text-alternative md:text-md">
            {description}
          </p>
          <div className="mt-6 flex gap-x-4 md:mt-8 justify-center">
            {buttons.map((button, index) => (
              <Button key={index} {...button}>
                {button.title}
              </Button>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute inset-0 -z-10">
        <img
          src={image.src}
          className="size-full object-cover"
          alt={image.alt}
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>
    </section>
  );
};

export const Cta3Defaults: Cta3Props = {
  heading: "Medium length heading goes here",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
  buttons: [{ title: "Button" }],
  image: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
    alt: "Relume placeholder image",
  },
};
