import {
  gradEnd,
  gradStart,
  logo,
  setupLogo,
  svgContainer,
  svgPath,
} from '../styles/logo.css';

export const Logo = ({
  text = true,
  logoSize,
  fontSize,
  setup = false,
}: {
  text?: boolean;
  logoSize?: string;
  fontSize?: string;
  setup?: boolean;
}) => {
  return (
    <div
      className={logo}
      style={fontSize ? { fontSize: fontSize } : {}}
    >
      <svg
        id="ifelfi-logo"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 280.98 212.24"
        className={svgContainer}
        style={logoSize ? { width: logoSize } : {}}
      >
        <defs>
          <linearGradient
            id="custom-grad"
            x1="139.49"
            y1=".5"
            x2="139.49"
            y2="209.74"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor={gradStart} />
            <stop offset="1" stopColor={gradEnd} />
          </linearGradient>
        </defs>
        <g id="layer">
          <path
            id="logo"
            className={`${svgPath} ${setup && setupLogo}`}
            d="M226.13,209.74H19.9c-10.71,0-19.4-8.69-19.4-19.4s8.69-19.4,19.4-19.4h49.34v-69.45c-19.29-7.72-32.95-26.61-32.95-48.63C36.29,23.99,59.77.5,88.64.5s52.36,23.49,52.36,52.35c0,22.02-13.66,40.9-32.95,48.63v69.45s98.68,0,98.68,0v-69.45c-19.29-7.72-32.96-26.61-32.96-48.63,0-28.87,23.49-52.35,52.35-52.35s52.35,23.49,52.35,52.35c0,22.02-13.66,40.9-32.95,48.63v88.85c0,10.71-8.69,19.4-19.4,19.4ZM226.12,39.3c-7.47,0-13.55,6.08-13.55,13.55s6.08,13.55,13.55,13.55,13.55-6.08,13.55-13.55-6.08-13.55-13.55-13.55ZM88.64,39.3c-7.47,0-13.55,6.08-13.55,13.55s6.08,13.55,13.55,13.55,13.55-6.08,13.55-13.55-6.08-13.55-13.55-13.55Z"
          />
        </g>
      </svg>
      {text && 'IfCloud'}
    </div>
  );
};
