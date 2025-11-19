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

const transition = { duration: 0.2, ease: [0.76, 0, 0.24, 1] };

export const appear = {
  initial: {
    opacity: 0,
  },
  open: {
    opacity: 1,
    transition: { duration: 0.15 },
  },
  closed: {
    opacity: 0,
    transition: { duration: 0.35 },
  },
};

export const background = {
  initial: {
    height: 0,
  },
  open: {
    height: "100vh",
    transition,
  },
  closed: {
    height: 0,
    transition,
  },
};
