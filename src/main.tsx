import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { RecoilRoot } from 'recoil';
import { Api } from './types/env';

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const auth = import.meta.env.VITE_AUTH_API as string;
const cloud = import.meta.env.VITE_CLOUD_API as string;

export const api: Api = {
  auth, 
  login: `${auth}/auth/local/login`,
  logout: `${auth}/user/logout`,
  validate: `${auth}/token/validate`,
  cloud,
};

const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <RecoilRoot>
        <RouterProvider router={router} />
      </RecoilRoot>
    </StrictMode>
  );
}
