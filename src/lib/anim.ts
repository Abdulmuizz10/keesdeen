export const opacity = {
  initial: {
    opacity: 1,
  },
  close: {
    opacity: 0,
    transition: { duration: 0.5 },
  },
  open: {
    opacity: 1,
    // transition: { duration: 0.5 },
  },
};

export const slideUp = {
  initial: {
    y: "100%",
  },
  open: (i: any) => ({
    y: "0%",
    transition: { duration: 0.7, delay: 0.01 * i },
  }),
  closed: {
    y: "100%",
    transition: { duration: 0.5 },
  },
};
