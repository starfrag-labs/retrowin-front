import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { themes } from '../css/themes/index.css';
import { root } from '../css/styles/root.css';

export const Route = createRootRouteWithContext<{
  accessToken: string;
  setAccessToken: (accessToken: string) => void;
  theme: string;
  setTheme: (theme: string) => void;
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
  const theme = Route.useRouteContext().theme;
  return (
    <>
      <div className={setTheme(theme)}>
        <div className={root}>
          <Outlet />
          <TanStackRouterDevtools position="bottom-right" />
        </div>
      </div>
    </>
  );
}
