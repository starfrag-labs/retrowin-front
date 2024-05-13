import { RouterProvider, createRouter } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { routeTree } from './routeTree.gen';
import { useState } from 'react';
import { useTokenStore } from './store/tokenStore';

const router = createRouter({
  routeTree,
  context: {
    accessToken: '',
    setAccessToken: () => {},
    theme: 'light',
    setTheme: () => {},
  },
});
const queryClient = new QueryClient();

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export function App() {
  const accessToken = useTokenStore((state) => state.accessToken);
  const setAccessToken = useTokenStore((state) => state.updateAccessToken);
  const [theme, setTheme] = useState('light');

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider
        router={router}
        context={{ accessToken, setAccessToken, theme: theme, setTheme }}
      />
      <ReactQueryDevtools
        initialIsOpen={false}
        buttonPosition="top-right"
        position="top"
      />
    </QueryClientProvider>
  );
}
