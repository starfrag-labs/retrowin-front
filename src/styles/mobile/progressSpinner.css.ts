import { style } from "@vanilla-extract/css";
import { flexCenter } from "../common/container.css";

export const spinnerContainer = style({
  position: 'relative',
  display: 'flex',
  borderRadius: '50%',
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  width: '2rem',
  height: '2rem',
  background: 'conic-gradient(gray 0deg, white 0deg)',
});

export const spinner = style([flexCenter, {
  width: '75%',
  height: '75%',
  borderRadius: "inherit",
  backgroundColor: 'white',
  color: 'black',
  margin: 'auto',
  fontSize: '0.7rem',
  fontWeight: 'bold',
  textAlign: 'center',
}]);