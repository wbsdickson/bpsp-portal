export const MotionVariant2 = {
  hidden: {
    opacity: 0,
    y: 5,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -5,
    transition: {
      ease: "easeOut" as const,
    },
  },
};
