import { Transition, Variants } from "framer-motion";

export const springs = {
  snappy: {
    type: "spring",
    stiffness: 400,
    damping: 30,
    mass: 0.8,
  } as Transition,

  smooth: {
    type: "spring",
    stiffness: 250,
    damping: 25,
    mass: 1,
  } as Transition,

  panel: {
    type: "spring",
    stiffness: 380,
    damping: 38,
    mass: 0.9,
  } as Transition,

  gentle: {
    type: "spring",
    stiffness: 200,
    damping: 28,
    mass: 1.1,
  } as Transition,
};

export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: springs.snappy,
  },
};

export const slideUpVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springs.snappy,
  },
};

export const slideRightVariants: Variants = {
  hidden: { opacity: 0, x: -12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: springs.panel,
  },
};

export const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: springs.snappy,
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.02,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springs.snappy,
  },
};

export const listItemVariants: Variants = {
  hidden: { opacity: 0, y: 10, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: springs.panel,
  },
  exit: {
    opacity: 0,
    y: -6,
    filter: "blur(4px)",
    transition: { duration: 0.15 },
  },
};

export const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: springs.panel,
};

export const layoutSpring = {
  type: "spring" as const,
  stiffness: 420,
  damping: 36,
  mass: 0.85,
};

export const detailPanelVariants: Variants = {
  hidden: { opacity: 0, x: 24, scale: 0.98 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: springs.panel,
  },
  exit: {
    opacity: 0,
    x: 16,
    scale: 0.99,
    transition: { duration: 0.2 },
  },
};

export const filterChipVariants: Variants = {
  idle: { scale: 1 },
  active: { scale: 1.02 },
  tap: { scale: 0.97 },
};

export const hoverLift = {
  whileHover: { y: -2, transition: springs.snappy },
  whileTap: { scale: 0.99, transition: { duration: 0.08 } },
};

export const premiumCardHover = {
  whileHover: {
    y: -3,
    boxShadow: "0 12px 40px -12px rgba(118, 132, 240, 0.25)",
    borderColor: "rgba(255,255,255,0.14)",
    transition: springs.snappy,
  },
  whileTap: { scale: 0.995, transition: { duration: 0.1 } },
};
