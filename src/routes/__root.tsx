import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { QueryClient } from '@tanstack/react-query';
import { defaultContainer } from '../styles/global/container.css';

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  pendingComponent: () => <div>Loading...</div>,
  component: RootComponent,
});

function RootComponent() {
  return (
    <div className={defaultContainer}>
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
    </div>
  );
}
