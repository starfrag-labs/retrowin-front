import { Navigate, createFileRoute } from '@tanstack/react-router';
import { Logo } from '../components/logo';
import { api } from '../utils/config';
import { isValid, issue } from '../utils/api/auth';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { button } from '../css/styles/button.css';
import { indexBackground } from '../css/styles/background.css';
import { blurContainer } from '../css/styles/container.css';
import { useTokenStore } from '../store/tokenStore';

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
  loader: async ({ deps: { code } }) => {
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
  const accessToken = useTokenStore((state) => state.accessToken);
  const setAccessToken = useTokenStore((state) => state.setAccessToken);
  const [status, setStatus] = useState('pending');

  const data = Route.useLoaderData();

  useEffect(() => {
    if (data && data.accessToken) {
      setAccessToken(data.accessToken);
    }
  }, [data, setAccessToken]);

  useEffect(() => {
    if (!accessToken) {
      setStatus('done');
      return;
    }
    isValid(accessToken)
      .catch(() => {
        setAccessToken('');
      })
      .finally(() => {
        setStatus('done');
      });
  }, [accessToken, setAccessToken]);

  // If the user is logged in, redirect them to the cloud page
  if (status === 'done' && accessToken) {
    return <Navigate to="./cloud" />;
  }

  if (status === 'pending') {
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
