import { Link, Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { whiteTheme } from '../css/theme/white.css';
import { root } from '../css/style.css';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <div className={whiteTheme}>
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
