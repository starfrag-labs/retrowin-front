import { createTheme } from "@vanilla-extract/css";
import { colors, primaryColor } from "../global.css";
import { vars } from "./contract.css";

export const defaultTheme = createTheme(vars, {
  color: {
    default: colors.grey[900],
  },
  font: {
    default: 'Roboto, sans-serif',
  },
  backgroundColor: {
    default: primaryColor(100, 50)[500],
  },
});
