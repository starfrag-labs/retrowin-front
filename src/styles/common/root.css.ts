import { globalStyle } from "@vanilla-extract/css";

globalStyle("html", {
  width: '100%',
  height: '100%',
})

globalStyle("body", {
  width: '100%',
  height: '100%',
  margin: 0,
  padding: 0,
  fontFamily: 'Roboto, sans-serif',
  userSelect: 'none',
  WebkitUserSelect: 'none',
  MozUserSelect: 'none',
  msUserSelect: 'none',
  color: 'rgb(255, 255, 255)',
})