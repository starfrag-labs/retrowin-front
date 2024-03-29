import { Link, Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { root } from '../css/style.css';
import { themes } from '../css/themes/index.css';

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
      <div className={setTheme('default')}>
        <div className={root}>
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
          <TanStackRouterDevtools position="bottom-right" />
        </div>
      </div>
    </>
  );
}
