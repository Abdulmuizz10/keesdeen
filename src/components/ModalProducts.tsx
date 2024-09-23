import { Input } from "@relume_io/relume-ui";
import { BiSearch } from "react-icons/bi";

type Props = {
  heading: string;
  inputIcon: React.ReactNode;
};

export type GridList5Props = React.ComponentPropsWithoutRef<"section"> &
  Partial<Props>;

export const GridList5 = (props: GridList5Props) => {
  const { heading, inputIcon } = {
    ...GridList5Defaults,
    ...props,
  } as Props;
  return (
    <section>
      <div className="grid auto-cols-fr grid-cols-1 items-end gap-4 pb-5 md:grid-cols-[1fr_max-content] md:gap-6 md:pb-6">
        <div className="w-full max-w-lg">
          <h1 className="text-xl font-bold md:text-2xl bricolage-grotesque">
            {heading}
          </h1>
        </div>
        <div className="flex items-center justify-between md:justify-normal">
          <Input placeholder="Search" icon={inputIcon} className="mr-4" />
        </div>
      </div>
      <div className="grid w-full auto-cols-fr grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"></div>
    </section>
  );
};

export const GridList5Defaults: GridList5Props = {
  heading: "Search products",
  inputIcon: <BiSearch className="size-6" />,
};
