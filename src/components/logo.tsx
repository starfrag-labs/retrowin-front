import { logo, logoBack, logoFront } from '../css/styles/logo.css';

export function Logo({ fontSize }: { fontSize?: string }) {
  return (
    <div className={logo} {
      ...(fontSize ? { style: { fontSize } } : {})
    }>
      <div className={logoFront}>if</div>
      <div className={logoBack}>cloud</div>
    </div>
  );
}
