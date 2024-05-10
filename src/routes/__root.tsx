import { Outlet, createRootRoute, createRootRouteWithContext } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { themes } from '../css/themes/index.css';
import { root } from '../css/styles/root.css';
import { issue } from '../utils/api/auth';

export const Route = createRootRouteWithContext<{
  accessToken: string;
}>()({
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
          <Outlet />
          <TanStackRouterDevtools position="bottom-right" />
        </div>
      </div>
    </>
  );
}
