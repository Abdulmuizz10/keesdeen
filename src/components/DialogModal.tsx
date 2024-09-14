import {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  // DialogHeader,
  // DialogTitle,
  // DialogDescription,
  // DialogFooter,
  // Button,
} from "@relume_io/relume-ui";
import { CiSearch } from "react-icons/ci";
import { GridList5 } from "./ModalProducts";

const DialogModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <CiSearch className="text-3xl cursor-pointer" />
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay className="bg-black/50" />
        <DialogContent className="w-full max-w-xl bg-white p-10 md:p-12 overflow-y-auto max-h-[500px] rounded-md">
          {/* <DialogHeader>
            <DialogTitle>Modal Title</DialogTitle>
            <DialogDescription>Modal Description</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="link" size="link" asChild>
              <a
                href="https://www.relume.io"
                className="underline"
                target="_blank"
                rel="noopener"
              >
                Modal Footer
              </a>
            </Button>
          </DialogFooter> */}
          <GridList5 />
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

export default DialogModal;
