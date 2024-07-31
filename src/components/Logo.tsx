import { logo, logoImage } from '../styles/logo.css';

export const Logo = ({
  text = true,
  logoSize = 2,
  fontSize = 2,
}: {
  text?: boolean;
  logoSize?: number;
  fontSize?: number;
}) => {
  return (
    <div
      className={logo}
      style={{
        fontSize: `${fontSize}rem`,
      }}
    >
      <svg
        id="ifelfi-logo"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 280.98 212.24"
        className={logoImage}
        width={`${logoSize}rem`}
      >
        <defs>
          <linearGradient
            id="custom-grad"
            x1="140.49"
            y1="1.5"
            x2="140.49"
            y2="210.74"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stop-color="var(--grad-start)" />
            <stop offset="1" stop-color="var(--grad-end)" />
          </linearGradient>
        </defs>
        <g id="layer">
          <path
            id="logo"
            d="M227.13,210.74H20.9c-10.71,0-19.4-8.69-19.4-19.4s8.69-19.4,19.4-19.4h49.34v-69.45c-19.29-7.72-32.95-26.61-32.95-48.63C37.29,24.99,60.77,1.5,89.64,1.5s52.36,23.49,52.36,52.35c0,22.02-13.66,40.9-32.95,48.63v69.45s98.68,0,98.68,0v-69.45c-19.29-7.72-32.96-26.61-32.96-48.63,0-28.87,23.49-52.35,52.35-52.35s52.35,23.49,52.35,52.35c0,22.02-13.66,40.9-32.95,48.63v88.85c0,10.71-8.69,19.4-19.4,19.4ZM227.12,40.3c-7.47,0-13.55,6.08-13.55,13.55s6.08,13.55,13.55,13.55,13.55-6.08,13.55-13.55-6.08-13.55-13.55-13.55ZM89.64,40.3c-7.47,0-13.55,6.08-13.55,13.55s6.08,13.55,13.55,13.55,13.55-6.08,13.55-13.55-6.08-13.55-13.55-13.55Z"
          />
        </g>
      </svg>
      {text && 'IfCloud'}
    </div>
  );
};
