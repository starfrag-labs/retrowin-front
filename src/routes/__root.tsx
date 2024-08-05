import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { QueryClient } from '@tanstack/react-query';
import config from '../utils/config';
import { SetupPage } from '../components/SetupPage';
import {
  checkUserQueryOption,
  getProfileQueryOption,
} from '../utils/queryOptions/user.query';

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  beforeLoad: async ({ context: { queryClient } }) => {
    if (import.meta.env.PROD) {
      return new Promise((resolve, reject) => {
        queryClient
          .ensureQueryData(getProfileQueryOption)
          .then(() => {
            resolve('done');
          })
          .catch(() => {
            window.location.href = `${config.auth}?redirect=${config.redirectUrl}`;
            reject();
          });
      }).then(async () => {
        await queryClient.ensureQueryData(checkUserQueryOption);
      });
    }
  },
  loader: async () => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
  },
  pendingComponent: () => <SetupPage />,
  component: RootComponent,
});

function RootComponent() {
  return (
    <Outlet />
  );
}
