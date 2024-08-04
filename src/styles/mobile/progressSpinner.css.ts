import { style } from '@vanilla-extract/css';
import { flexCenter } from '../common/container.css';
import { theme } from '../themes/theme.css';

export const spinnerContainer = style([flexCenter,{
  position: 'relative',
  borderRadius: '50%',
  width: '2rem',
  height: '2rem',
  background: `conic-gradient(${theme.text.normal} 0deg, ${theme.primary.normal} 0deg)`,
}]);

export const spinner = style([
  flexCenter,
  {
    width: '75%',
    height: '75%',
    borderRadius: 'inherit',
    backgroundColor: theme.primary.normal,
    color: theme.text.normal,
    margin: 'auto',
    fontSize: '0.7rem',
    fontWeight: 'bold',
    textAlign: 'center',
  },
]);
