import { Navigate, createFileRoute } from '@tanstack/react-router';
import { useRecoilState } from 'recoil';
import { userState } from '../features/user/userState';
import { useEffect } from 'react';
import { centerContainer } from '../css/styles/container.css';
import { Logo } from '../components/logo';
import { api } from '../utils/config';
import { isValid, issue } from '../utils/api/auth';
import { z } from 'zod';

const codeSchema = z.object({
  code: z.string().optional(),
});

type CodeSchema = z.infer<typeof codeSchema>;

export const Route = createFileRoute('/')({
  component: IndexComponent,
  validateSearch: codeSchema,
  beforeLoad: async ({ search: { code } }) => {
    if (!code) {
      return;
    }
    const response = await issue(code);
    const accessToken = response.headers['authorization'];
    return {
      accessToken: accessToken,
    };
  },
  loader: async ({ context: { accessToken } }) => {
    console.log(accessToken);
  },
});

function IndexComponent() {
  const [user, setUser] = useRecoilState(userState);
  const loading = false;
  const data = Route.useLoaderData();
  console.log(data);

  const validate = async () => {
    const accessToken = user.accessToken;
    if (!accessToken) {
      setUser({
        ...user,
        loggedIn: false,
      });
      return;
    }
    const response = await isValid(accessToken);
    if (response.status === 200) {
      setUser({
        ...user,
        accessToken: response.headers['authorization'],
        loggedIn: true,
      });
    } else {
      setUser({
        ...user,
        loggedIn: false,
      });
    }
  };

  useEffect(() => {
    validate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (user.loggedIn) {
    return <Navigate to="/cloud" />;
  }

  const loginUrl = `${api.oauth}?redirect_url=${api.redirectUrl}`;
  return (
    <div className={centerContainer}>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <Logo fontSize="4rem" />
          <div>
            Upload and share your files with your friends, family, and the
            world.
          </div>
          <a href={loginUrl}>
            <button>Login</button>
          </a>
        </div>
      )}
    </div>
  );
}
