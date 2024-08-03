import { keyframes } from "@vanilla-extract/css";

export const popup = keyframes({
  '0%': { opacity: 0 },
  '100%': { opacity: 1 },
});

export const slideUp = keyframes({
  from: {
    transform: 'translateY(100%)',
  },
  to: {
    transform: 'translateY(0)',
  },
});

