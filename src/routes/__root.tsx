import { Link, Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { themes } from '../css/themes/index.css';
import { root } from '../css/styles/root.css';
import { logo, logoBack, logoFront } from '../css/styles/logo.css';
import { header } from '../css/styles/header.css';
import { button } from '../css/styles/button.css';
import { pageContainer } from '../css/styles/container.css';

export const Route = createRootRoute({
  component: RootComponent,
});

const setTheme = (theme: string) => {
  switch (theme) {
    case 'dark':
      return themes.dark;
    case 'light':
      return themes.light;
    default:
      return themes.default;
  }
};

function RootComponent() {
  return (
    <>
      <div className={setTheme('light')}>
        <div className={root}>
          <header className={header}>
            <div className={logo}>
              <div className={logoFront}>if</div>
              <div className={logoBack}>cloud</div>
            </div>
            <button className={button}>logout</button>
          </header>
          <div className={pageContainer}>
            <Link
              to="/"
              activeProps={{
                className: 'font-bold',
              }}
              activeOptions={{ exact: true }}
            >
              Home
            </Link>{' '}
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
          <TanStackRouterDevtools position="bottom-right" />
        </div>
      </div>
    </>
  );
}
