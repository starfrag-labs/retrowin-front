import { Navigate, createFileRoute, redirect } from '@tanstack/react-router';
import { z } from 'zod';
import { useTokenStore } from '../store/token.store';
import { getProfile, issue } from '../api/auth';
import config from '../utils/config';
import { useUserStore } from '../store/user.store';
import { checkUser, enrollUser } from '../api/cloud';

const codeSchema = z.object({
  code: z.string().optional(),
});

export const Route = createFileRoute('/')({
  validateSearch: codeSchema,
  beforeLoad: async ({ search: { code } }) => {
    if (code) {
      const setAccessToken = useTokenStore.getState().setAccessToken;
      const accessToken = await issue(code)
        .then((response) => {
          const token = response.headers['authorization'].split(' ')[1];
          return token;
        })
        .catch(() => {
          return null;
        });
      setAccessToken(accessToken);
    }
    const accessToken = useTokenStore.getState().accessToken;
    const setIsCloudUser = useUserStore.getState().setIsCloudUser;
    const setProfile = useUserStore.getState().setProfile;
  
    if (accessToken) {
      await checkUser(accessToken)
        .then(() => {
          setIsCloudUser(true);
        })
        .catch(async () => {
          await enrollUser(accessToken).then(() => {
            setIsCloudUser(true);
          });
        });
      await getProfile(accessToken)
        .then((response) => {
          setProfile(response.data.data);
        })
      throw redirect({
        to: '/main',
      });
    }
  },
  pendingComponent: () => <div>Loading...</div>,
  component: IndexComponent,
});

function IndexComponent() {
  const accessToken = useTokenStore((state) => state.accessToken);
  const code = Route.useSearch().code;

  if (!accessToken && !code) {
    const loginUrl = `${config.oauth}?redirect_url=${config.redirectUrl}`;
    window.location.href = loginUrl;
  }

  if (accessToken) {
    return <Navigate to="/main" />;
  }

  return <div>loading</div>;
}
