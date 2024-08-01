import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { QueryClient } from '@tanstack/react-query';
import { defaultContainer } from '../styles/global/container.css';
import { AxiosError } from 'axios';
import { getProfile } from '../api/auth';
import { checkUser, enrollUser } from '../api/cloud';
import config from '../utils/config';
import { useUserStore } from '../store/user.store';
import { LoadingPage } from '../components/LoadingPage';

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  beforeLoad: async () => {
    if (import.meta.env.PROD) {
      return new Promise((resolve, reject) => {
        const setProfile = useUserStore.getState().setProfile;
        getProfile()
          .then((response) => {
            setProfile(response.data.data);
            resolve('done');
          })
          .catch(() => {
            window.location.href = `${config.auth}?redirect=${config.redirectUrl}`;
            reject();
          });
      }).then(() => {
        checkUser().catch(async (error: AxiosError) => {
          if (error.response?.status === 404) {
            await enrollUser();
            return;
          }
          throw error;
        });
      });
    }
  },
  loader: async () => {
    await new Promise((resolve) => setTimeout(resolve, 6000));
  },
  pendingComponent: () => <LoadingPage />,
  component: RootComponent,
});

function RootComponent() {
  return (
    <div className={defaultContainer}>
      <Outlet />
    </div>
  );
}
