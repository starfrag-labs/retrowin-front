import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { QueryClient } from '@tanstack/react-query';
import { defaultContainer } from '../styles/global/container.css';
import { Loading } from '../components/Loading';
import { AxiosError } from 'axios';
import { getProfile } from '../api/auth';
import { checkUser, enrollUser } from '../api/cloud';
import config from '../utils/config';
import { useUserStore } from '../store/user.store';

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  beforeLoad: async () => {
    const setProfile = useUserStore.getState().setProfile;
    await getProfile()
      .then((response) => {
        setProfile(response.data.data);
      })
      .catch(() => {
        window.location.href = `${config.auth}?redirect=${config.redirectUrl}`;
      });
    await checkUser().catch(async (error: AxiosError) => {
      if (error.response?.status === 404) {
        await enrollUser();
        return;
      }
      throw error;
    });
  },
  pendingComponent: () => <Loading />,
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
