import { Navigate, createFileRoute } from '@tanstack/react-router';
import { Logo } from '../components/logo';
import { api } from '../utils/config';
import { isValid, issue } from '../utils/api/auth';
import { z } from 'zod';
import { useEffect } from 'react';
import { useUserStore } from '../store/userStore';
import { button } from '../css/styles/button.css';
import { indexBackground } from '../css/styles/background.css';
import { blurContainer } from '../css/styles/container.css';

const codeSchema = z.object({
  code: z.string().optional(),
});

export const Route = createFileRoute('/')({
  component: IndexComponent,
  validateSearch: codeSchema,
  loaderDeps: ({ search: { code } }) => {
    return {
      code: code,
    };
  },
  loader: async ({ deps: { code }, context: {accessToken: test, setAccessToken} }) => {
    setAccessToken('test');
    console.log('test', test);
    
    if (!code) {
      return;
    }
    const response = await issue(code);
    if (response.status !== 200) {
      return;
    }
    const accessToken = response.headers['authorization'].split(' ')[1];
    return {
      accessToken: accessToken,
    };
  },
});

function IndexComponent() {
  const accessToken = useUserStore((state) => state.accessToken);
  const loggedIn = useUserStore((state) => state.loggedIn);
  const updateLoggedIn = useUserStore((state) => state.updateLoggedIn);
  const updateAccessToken = useUserStore((state) => state.updateAccessToken);

  const data = Route.useLoaderData();
  useEffect(() => {
    if (data && data.accessToken) {
      updateAccessToken(data.accessToken);
    } else {
      updateLoggedIn('loggedOut');
    }
  }, [data, updateAccessToken, updateLoggedIn]);

  useEffect(() => {
    if (accessToken) {
      updateLoggedIn('pending');
      isValid(accessToken)
        .then(() => {
          updateLoggedIn('loggedIn');
        })
        .catch(() => {
          updateLoggedIn('loggedOut');
        })
    }
  }, [accessToken, updateLoggedIn]);

  // If the user is logged in, redirect them to the cloud page
  if (loggedIn === 'loggedIn') {
    return <Navigate to="./cloud" />;
  }

  if (loggedIn === 'pending') {
    return <div>Loading...</div>;
  }

  // If the user is not logged in, show the login page
  const loginUrl = `${api.oauth}?redirect_url=${api.redirectUrl}`;
  return (
    <div className={indexBackground}>
      <div className={blurContainer}>
        <Logo fontSize="4rem" />
        <div>
          Upload and share your files with your friends, family, and the world.
        </div>
        <a href={loginUrl}>
          <button className={button}>Login</button>
        </a>
      </div>
    </div>
  );
}
