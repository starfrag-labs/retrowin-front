import { RouterProvider, createRouter } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { routeTree } from './routeTree.gen';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { appContainer } from './styles/common/container.css';
import { useThemeStore } from './store/theme.store';
import { useEffect } from 'react';
import type { ThemeKey } from './store/theme.store';

const queryClient = new QueryClient();
const router = createRouter({
  routeTree,
  context: {
    queryClient: queryClient,
  },
  basepath: import.meta.env.VITE_BASE_URL,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export function App() {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);

  useEffect(() => {
    const themeKey = localStorage.getItem('theme');
    if (themeKey === 'prefers-color-scheme' || !themeKey) {
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      setTheme(prefersDark ? 'dark' : 'light');
    } else setTheme(themeKey as ThemeKey);
  }, [setTheme]);

  return (
    <div className={`${theme} ${appContainer}`}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        {import.meta.env.DEV && (
          <ReactQueryDevtools
            initialIsOpen={false}
            buttonPosition="bottom-left"
            position="bottom"
          />
        )}
      </QueryClientProvider>
    </div>
  );
}
