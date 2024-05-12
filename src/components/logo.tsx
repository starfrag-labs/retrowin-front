import { Link } from '@tanstack/react-router';
import { logo, logoBack, logoFront } from '../css/styles/logo.css';

export function Logo({ fontSize }: { fontSize?: string }) {
  return (
    <Link
      to={'/'}
      className={logo}
      {...(fontSize ? { style: { fontSize } } : {})}
    >
      <div className={logoFront}>if</div>
      <div className={logoBack}>cloud</div>
    </Link>
  );
}
