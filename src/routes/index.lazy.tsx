import { Link, Outlet, createLazyFileRoute } from '@tanstack/react-router'
import { header } from '../css/styles/header.css';
import { button } from '../css/styles/button.css';
import { pageContainer } from '../css/styles/container.css';
import { logo, logoFront, logoBack } from '../css/styles/logo.css';

export const Route = createLazyFileRoute('/')({
  component: Index
})

function Index() {
  return (
    <div>
      <header className={header}>
        <div className={logo}>
          <div className={logoFront}>if</div>
          <div className={logoBack}>cloud</div>
        </div>
        <button className={button}>logout</button>
      </header>
      <div className={pageContainer}>
        <Link
          to={'/about'}
          activeProps={{
            className: 'font-bold',
          }}
        >
          About
        </Link>
        <Outlet />
      </div>
    </div>
  );
}