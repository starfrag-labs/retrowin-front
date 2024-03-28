import { createThemeContract } from "@vanilla-extract/css"

export const vars = createThemeContract({
  color: {
    title: null,
    body: null,
  },
  font: {
    default: null,
  },
  padding: {
    default: null,
  },
  backgroundColor: {
    default: null,
  },
  display: {
    default: null,
  },
})