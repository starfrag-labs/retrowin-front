import { createFileRoute, redirect } from '@tanstack/react-router';
import { z } from 'zod';
import { getProfile } from '../api/auth';
import config from '../utils/config';
import { useUserStore } from '../store/user.store';
import { Loading } from '../components/Loading';

const codeSchema = z.object({
  code: z.string().optional(),
});

export const Route = createFileRoute('/')({
  validateSearch: codeSchema,
  beforeLoad: async () => {
    const setProfile = useUserStore.getState().setProfile;

    await getProfile()
      .then((response) => {
        setProfile(response.data.data);
      })
      .catch(() => {
        window.location.href = `${config.auth}?redirect=${config.redirectUrl}`;
      });
    throw redirect({
      to: '/main',
    });
  },
  pendingComponent: () => <Loading />,
  component: IndexComponent,
});

function IndexComponent() {
  return <Loading />;
}
